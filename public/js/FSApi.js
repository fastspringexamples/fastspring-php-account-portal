/*
 *  Custom FastSpring API client based on JQuery
 *  It uses the JWT found in the localStorage
 */

function changeBaseProduct(subscriptionId) {
    const newBase = $(`#baseInput-${subscriptionId}`).val();
    // Query API
    const payload = {
        subscriptions: [{
            subscription: subscriptionId,
            product: newBase,
            quantity: 1
        }]
    };
    showSubsLoader(subscriptionId);
    $.post(`${window.location.origin}/subscriptions`, payload)
        .done((resNewSub) => {
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
                alert('Could not change base product: ', resNewSub);
                hideSubsLoader(subscriptionId);
            }
        })
        .fail(() => {
            alert('Errr');
        });
}


function showSubsLoader(subscriptionId) {
    $(`#subs-${subscriptionId}`).addClass('loading');
    $(`#subs-${subscriptionId} .spinner-border`).removeClass('hide');
}

function hideSubsLoader(subscriptionId) {
    $(`#subs-${subscriptionId}`).removeClass('loading');
    $(`#subs-${subscriptionId} .spinner-border`).addClass('hide');
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

function uncancelSubscription(subscriptionId) {
    const payload = {
        subscriptions: [{
            subscription: subscriptionId,
            deactivation: "null"
        }]
    };
    showSubsLoader(subscriptionId);
    $.post(`${window.location.origin}/subscriptions`, payload)
        .done((resNewSub) => {
            if (resNewSub && JSON.parse(resNewSub).success) {
                // Reload content
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
        });
}
