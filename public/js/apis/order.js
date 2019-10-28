/*   
 *  Functions to interact with the /orders endpoint
 */


function updateOrders(payload) {
    // TODO show loader
    const orderId = getOrderId();
    const token = getToken();
    payload.token = token;
    showItemLoader();
    $.post(`${window.location.origin}/orders`, payload)
        .done((resNewOrder) => {
            if (resNewOrder && resNewOrder.success) {
                // Reload content
                setTimeout(function() {
                    $.post(`${window.location.origin}/getCustomerOrders`, { token, orderIds: [orderId] })
                        .done((orderData) => {
                            const newOrder = orderData.orders[0];
                            const newOrderElement = renderOrder(newOrder);
                            $(`#order-${orderId}`).html(newOrderElement);
                            hideItemLoader();
                        });
                }, 5000);
            } else {
                alert('Could not update subscription: ', resNewOrder);
                hideItemLoader();
            }
        });
}

/*
 *  Update tags and attributes
 *  https://docs.fastspring.com/integrating-with-fastspring/fastspring-api/orders#id-/orders-UpdateOrderTagsandAttributes
 */
function createOrderTags() {
    const tagsForm = document.getElementById('customTagsForm');
    const tags = {};
    tags[tagsForm.tagKey.value] = tagsForm.tagValue.value;
    // TODO some validation
    const payload = {
        orders: [{
            order: getOrderId(),
            tags
        }]
    };
    $('#tagsModal').modal('hide');
    updateOrders(payload);
}

function createProductAttributes(productPath) {
    const prodAttrForm = document.getElementById(`productAttrForm-${productPath}`);
    const attributes = {};
    console.log(productPath, prodAttrForm, prodAttrForm[`attrKey-${productPath}`]);
    // TODO add validations
    attributes[prodAttrForm[`attrKey-${productPath}`].value] = prodAttrForm[`attrValue-${productPath}`].value;
    const payload = {
        orders: [{
            order: getOrderId(),
            items: [{
                product: productPath,
                attributes
            }]
        }]
    };
    $('#attributesModal').modal('hide');
    updateOrders(payload);
}

/* The following function is used to create a new order and complete the charge inmediately through the API
 * https://docs.fastspring.com/integrating-with-fastspring/fastspring-api/orders#id-/orders-CreateNewOrderandCompletetheCharge
 *
 * In order for this to work the customer must the customer must already have a payment method on file (i.e a subscription active)
 */
function chargeNewOrder() {
    const chargeForm = document.getElementById('chargeOrderForm');
    const productId = chargeForm.productId.value;
    const price = chargeForm.price.value;
    if (!(productId && price)) {
        alert('Please fill in both fields');
        return;
    }
    const accountId = getAccountId();
    const payload = {
        account: accountId,
        items: [{
            product: productId,
            pricing: {
                price: {
                    USD: price
                }
            }
        }]
    };
    // Add token to payload
    const token = getToken();
    payload.token = token;

    
    $('#charge-form-wrapper').addClass('loading');
    $('#charge-form-wrapper .spinner-border').show();
    
    // Perform charge request
    $.post(`${window.location.origin}/orders`, payload)
        .done((resNewOrder) => {
            if (resNewOrder && resNewOrder.success && resNewOrder.response.order) {
                // Reload table content
                // Give 2 seconds for changes to reflect in API
                setTimeout(function() {
                    $.post(`${window.location.origin}/getAccountDetails`, { token, accountId })
                        .done((resAccount) => {
                            if (resAccount && resAccount.success) {
                                const accountElement = renderAccountDetails(resAccount.account);
                                const ordersElement = resAccount.orders.length > 0 ?
                                    renderOrdersTable(resAccount.orders)
                                :
                                    renderNoOrders(resAccount.orders);
                                $('#account-container').html([accountElement, ordersElement]);
                                
                            }
                            $('#charge-form-wrapper').removeClass('loading');
                            $('#charge-form-wrapper .spinner-border').hide();
                            $('#chargeOrderModal').modal('hide');
                        });
                }, 3000);
            } else {
                alert('Could not create order, please make sure product exists');
                $('#charge-form-wrapper').removeClass('loading');
                $('#charge-form-wrapper .spinner-border').hide();
                $('#chargeOrderModal').modal('hide');
            }
        });
}
