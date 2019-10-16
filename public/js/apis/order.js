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
