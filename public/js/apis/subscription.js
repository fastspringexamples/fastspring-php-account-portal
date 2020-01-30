/*   
 *  Functions to interact with the /subscriptions endpoint
 */


function updateSubscription(payload, subscriptionId) {
    showItemLoader(subscriptionId);
    const token = getToken();
    payload.token = token;
    $.post(`${window.location.origin}/subscriptions`, payload)
        .done((resNewSub) => {
            if (resNewSub && resNewSub.success) {
                // Reload content
                setTimeout(function() {
                $.post(`${window.location.origin}/getCustomerSubscriptions`, { token, subscriptionIds: [subscriptionId] })
                    .done((subData) => {
                        const newSubs = subData.subscriptions[0];
                        const newSubsElement = renderSubscription(newSubs);
                        $(`#subs-${subscriptionId}`).html(newSubsElement);
                        hideItemLoader();
                    });
                }, 5000);
            } else {
                alert(`Could not update subscription: ${JSON.stringify(resNewSub.error)}`);
                hideItemLoader(subscriptionId);
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
                        percentage: 20,
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
    console.log(payload);
    updateSubscription(payload, subscriptionId);
}


function cancelSubscription() {
    // Close modal and show loader before doing the request
    showItemLoader();
    $('#discountModal').modal('hide');
    // Query API
    const subscriptionId = getSubsId();
    const token = getToken();
    const payload = { subscriptionId, token };
    $.post(`${window.location.origin}/subscriptions/delete`, payload)
        .done((resNewSub) => {
            if (resNewSub && resNewSub.success) {
                setTimeout(function() {
                    $.post(`${window.location.origin}/getCustomerSubscriptions`, { token, subscriptionIds: [subscriptionId] })
                        .done((subData) => {
                            const newSubs = subData.subscriptions[0];
                            const newSubsElement = renderSubscription(newSubs);
                            $(`#subs-${subscriptionId}`).html(newSubsElement);
                            hideItemLoader();
                        });
                }, 5000);
            } else {
                alert(`Could not cancel subscription: ${JSON.stringify(resNewSub.error)}`);
                hideItemLoader();
            }
        });
}
