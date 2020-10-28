/*   
 *  Functions to interact with the /accounts endpoint
 */

function getAuthenticatedURL() {
    const accountId = getAccountId();
    const token = getToken();
    $.post(`${window.location.origin}/getAuthenticatedURL`, { token, accountId })
        .done((resAuth) => {
            if (resAuth && resAuth.success) {
                const authURL = resAuth.url;
                window.open(authURL);
            } else {
                alert(resAuth.error);
            }
        });
}
