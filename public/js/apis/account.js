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
                $('#authenticated-container ').html(`
                    <a target="_blank" href='${authURL}'> Link to Portal </a>
                `);
            } else {
                alert(resAuth.error);
            }
        });
}
