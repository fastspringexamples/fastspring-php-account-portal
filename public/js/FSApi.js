/*
 *  Custom FastSpring API client based on JQuery
 *  It uses the JWT found in the localStorage
 */


function showSubsLoader(subscriptionId) {
    $(`#subs-${subscriptionId}`).addClass('loading');
    $(`#subs-${subscriptionId} .spinner-border`).removeClass('hide');
}

function hideSubsLoader(subscriptionId) {
    $(`#subs-${subscriptionId}`).removeClass('loading');
    $(`#subs-${subscriptionId} .spinner-border`).addClass('hide');
}

function updateSubscription(payload, subscriptionId) {
    showSubsLoader(subscriptionId);
    $.post(`${window.location.origin}/subscriptions`, payload)
        .done((resNewSub) => {
            if (resNewSub && JSON.parse(resNewSub).success) {
                // Reload content
                setTimeout(function() {
                $.post(`${window.location.origin}/getCustomerSubscriptions`, { subscriptionIds: [subscriptionId] })
                    .done((subData) => {
                        const newSubs = JSON.parse(subData).subscriptions[0];
                        const newSubsElement = renderSubscription(newSubs);
                        $(`#subs-${subscriptionId}`).html(newSubsElement);
                        hideSubsLoader(subscriptionId);
                    });
                }, 5000);
            } else {
                alert('Could not cancel subscription: ', resNewSub);
                hideSubsLoader(subscriptionId);
            }
        });
}

function changeSubsQuantity(subscriptionId) {
    const quantity = $(`#quantityInput-${subscriptionId}`).val();
    const payload = {
        subscriptions: [{
            subscription: subscriptionId,
            quantity
        }]
    };
    updateSubscription(payload, subscriptionId);
}

function changeBaseProduct(subscriptionId) {
    const newBase = $(`#baseInput-${subscriptionId}`).val();
    // Query API
    const payload = {
        subscriptions: [{
            subscription: subscriptionId,
            product: newBase
        }]
    };
    updateSubscription(payload, subscriptionId);
}

function applySubsDiscount() {
    const subscriptionId = getSubsId();
    const payload = {
        subscriptions: [
            {
                subscription: subscriptionId,
                pricing: {
                    discount: {
                        type: 'percent',
                        percentage: 5,
                        duration: 2
                    }
                }
            }
        ]
    };
    $('#discountModal').modal('hide');
    updateSubscription(payload, subscriptionId);
}

function uncancelSubscription(subscriptionId) {
    const payload = {
        subscriptions: [{
            subscription: subscriptionId,
            deactivation: 'null'
        }]
    };
    updateSubscription(payload, subscriptionId);
}


function cancelSubscription(subscriptionId) {
    showSubsLoader(subscriptionId);
    $.ajax({
        url: `${window.location.origin}/subscriptions/${subscriptionId}`,
        type: 'DELETE',
        success: function(resNewSub) {
            if (resNewSub && JSON.parse(resNewSub).success) {
                setTimeout(function() {
                    $.post(`${window.location.origin}/getCustomerSubscriptions`, { subscriptionIds: [ subscriptionId ] })
                        .done((subData) => {
                            const newSubs = JSON.parse(subData).subscriptions[0];
                            const newSubsElement = renderSubscription(newSubs);
                            $(`#subs-${subscriptionId}`).html(newSubsElement);
                            hideSubsLoader(subscriptionId);
                        });
                }, 5000);
            } else {
                alert('Could not cancel subscription: ', resNewSub);
                hideSubsLoader(subscriptionId);
            }
        }
    });
}

/* ORDERS API  */

function updateOrders(payload) {
    // TODO show loader
    const orderId = getOrderId();
    $.post(`${window.location.origin}/orders`, payload)
        .done((resNewOrder) => {
            if (resNewOrder && JSON.parse(resNewOrder).success) {
                // Reload content
                setTimeout(function() {
                    $.post(`${window.location.origin}/getCustomerOrders`, { orderIds: [orderId] })
                        .done((orderData) => {
                            const newOrder = JSON.parse(orderData).orders[0];
                            const newOrderElement = renderOrder(newOrder);
                            $(`#order-${orderId}`).html(newOrderElement);
                            // TODO hideSubsLoader(subscriptionId);
                        });
                }, 5000);
            } else {
                alert('Could not update subscription: ', resNewOrder);
                // TODO hideSubsLoader(subscriptionId);
            }
        });
}

function getAuthenticatedURL() {
    const accountId = getAccountId();
    $.post(`${window.location.origin}/getAuthenticatedURL`, { accountId })
        .done((resAuth) => {
            if (resAuth && JSON.parse(resAuth).success) {
                const authURL = JSON.parse(resAuth).url;
                $('#authenticated-container').html(`
                    <a target="_blank" href='${authURL}'> FastSpring Account Portal </a>
                `);
            } else {
                alert(JSON.parse(resAuth).error);
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
    updateOrders(payload);
}


/* Util function to retrieve accountId based on url*/
function getAccountId() {
    const url = new URL(window.location.href);
    const orderId = url.pathname.split('/')[2];
    return orderId;
}

/* Util function to retrieve orderId based on url*/
function getOrderId() {
    const url = new URL(window.location.href);
    const orderId = url.pathname.split('/')[4];
    return orderId;
}

function getSubsId() {
    const url = new URL(window.location.href);
    const subsId = url.pathname.split('/')[4];
    return subsId;
}

function goToOrder(orderId) {
    const accountId = getAccountId();
    window.location.href = `/account/${accountId}/order/${orderId}/overview.html`;
}

function goToSubscription(subscriptionId) {
    const accountId = getAccountId();
    window.location.href = `/account/${accountId}/subscription/${subscriptionId}/overview.html`;
}
