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
                alert('Could not cancel subscription: ', resNewSub.error);
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
    showItemLoader();
    const token = getToken();
    payload.token = token;
    $.ajax({
        url: `${window.location.origin}/subscriptions/${subscriptionId}`,
        type: 'DELETE',
        success: function(resNewSub) {
            if (resNewSub && resNewSub.success) {
                setTimeout(function() {
                    $.post(`${window.location.origin}/getCustomerSubscriptions`, { token, subscriptionIds: [ subscriptionId ] })
                        .done((subData) => {
                            const newSubs = subData.subscriptions[0];
                            const newSubsElement = renderSubscription(newSubs);
                            $(`#subs-${subscriptionId}`).html(newSubsElement);
                            hideItemLoader();
                        });
                }, 5000);
            } else {
                alert('Could not cancel subscription: ', resNewSub);
                hideItemLoader();
            }
        }
    });
}
