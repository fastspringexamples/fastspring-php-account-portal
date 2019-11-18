/*
 *  Common util functions used by all the pages in the app
 */

function showLoginLoader(subscriptionId) {
    $('#loginForm').addClass('loading');
    $('#loginForm .spinner-border').removeClass('hide');
}

function hideLoginLoader(subscriptionId) {
    $('#loginForm').removeClass('loading');
    $('#loginForm .spinner-border').addClass('hide');
}

function showItemLoader(subscriptionId) {
    $('.order-main-container').addClass('loading');
    $('.order-main-container .spinner-border').removeClass('hide');
}

function hideItemLoader(subscriptionId) {
    $('.order-main-container').removeClass('loading');
    $('.order-main-container .spinner-border').addClass('hide');
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
    const subsId = url.pathname.split('/')[6];
    return subsId;
}

function goToAccount() {
    const accountId = getAccountId();
    window.location.href = `/account/${accountId}/overview.html`;
}

function goToOrder(orderId) {
    const accountId = getAccountId();
    window.location.href = `/account/${accountId}/order/${orderId}/overview.html`;
}

function goToSubscription(subscriptionId) {
    const accountId = getAccountId();
    const orderId = getOrderId();
    window.location.href = `/account/${accountId}/order/${orderId}/subscription/${subscriptionId}/overview.html`;
}


function logout() {
    // Remove token from sessionStorage
    sessionStorage.removeItem('FS-token');
    // Redirect to login page
    window.location.href = '/login.html';
}

function forceLogout(errMessage) {
    alert(errMessage);
    logout();
}

/*  Retrieves private token to query API from sessionStorage.
 *  If token is not available we will redirect users back to login page.
 */
function getToken() {
    const token = JSON.parse(sessionStorage.getItem('FS-token'));
    if (!token) {
        forceLogout('Token not found, please login again!');
    } else {
        return token;
    }
}

// Initialize tooltip library when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
});
