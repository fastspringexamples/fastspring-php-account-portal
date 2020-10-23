function renderAccountDetails(account) {
    return (`
        <div class='row accountDetails'>
            <div class="col-4">
                <h5 style="text-align: center"> Your account </h5>
                <div class="card">
                    <div class="card-body">
                        <p class="card-text"> <i class="fa fa-user-circle-o" aria-hidden="true"></i> &nbsp;  ${account.contact.first}  ${account.contact.last}</p>
                        <p class='fs-link'> <i class="fa fa-address-card-o" aria-hidden="true"></i> &nbsp; ${account.contact.email} </p>
                        <p class="card-text"> <i class="fa fa-phone" aria-hidden="true"></i> &nbsp; Phone: &nbsp;${account.contact.phone || 'Not available'} </p>
                    </div>
                </div>
            </div>
            <div class='col'>
                <br> </br>
                <p> Access FastSpring-hosted management portal if you would like to update your
                payment information </p>
                <div id='authenticated-container'>
                    <button class="btn" style="background-color: #c90526; color: white;" type="button" id='auth-button' onclick='getAuthenticatedURL(this);'>
                        Get Access
                    </button>
                </div>
            </div>
        </div>
    `);
}

function renderOrdersTable(orders) {
    const orderRows = orders.map((order) => `
        <tr class='order-row' onclick="goToOrder('${order.id}');">
            <td> ${order.changedDisplay}</td>
            <td> ${order.reference} </td>
            <td> ${order.subtotalDisplay} </td>
            <td> ${(order.completed ? 'Completed' : 'Canceled')}
            </td>
        </tr>
    `);

    return (`
        <div id="orders-table-container" class='row'>
            <div class='col'>
                <ul class="nav nav-tabs" id="order-table-header">
                <li class="nav-item nav-link active" style="font-size: large;font-weight: bold;">
                    Your Orders
                </li>
            </ul>
            <table class="table table-hover">
                <thead>
                    <tr style="background-color: #c90526; color: white;">
                        <th scope="col"> Date </th>
                        <th scope="col"> Reference </th>
                        <th scope="col"> Subtotal </th>
                        <th scope="col"> Status </th>
                    </tr>
                </thead>
                <tbody>
                    ${orderRows.join('')}
                </tbody>
            </table>
            </div>
        </div>
        
    `);
}

function renderNoOrders() {
    return (`
        <div class='row'>
            <div class='col'>
                <p> There are no orders available for this customer </p>
            </div>
        </div>
    `);
}
