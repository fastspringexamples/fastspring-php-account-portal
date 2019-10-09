

function renderSubscription(subscription) {
    const cancelButton = subscription.state === 'active' ? `
            <button class="btn btn-secondary" data-toggle="modal" data-target="#discountModal">
                Cancel
            </button>`
        : `<button class="btn btn-primary" onclick="uncancelSubscription('${subscription.id}')">
                Uncancel
          </button>`;
    return (`
        <div class='container' style="padding-bottom: 10px; position: relative">
            <div class="spinner-border fs-spinner hide" role="status">
                <span class="sr-only">Loading...</span>
            </div>

            <div class='row' style="border-bottom: 1px solid; text-align: center; padding: 5px; background-color: #17a2b8!important; font-weight: bold;">
                 <span> Subscription Id: ${subscription.id} <span>
            </div>
            <div class='row' style="padding-top: 20px;">
                <div class='col-4'>
                    <div class='row'>
                        <div class='col-6 textCentered'>
                            Price
                        </div>
                        <div class='col-6'>
                            ${subscription.priceDisplay}
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-6 textCentered'>
                            Discount
                        </div>
                        <div class='col-6'>
                            ${subscription.discountDisplay}
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-6 textCentered' style="padding-right: 0">
                            <span style="border-top: 1px solid blue; padding: 1px 15px;"> Subtotal </span>
                        </div>
                        <div class='col-6'  style="padding-left: 0">
                            <span style="border-top: 1px solid blue; padding: 1px 15px;"> ${subscription.subtotalDisplay} </span>
                        </div>
                    </div>
                </div>
                <div class='col-4'>
                    <div class='row'>
                        Start date: ${subscription.beginDisplay}
                    </div>
                    <div class='row'>
                        Current Period: ${subscription.sequence}
                    </div>
                    <div class='row'>
                        Next charge on ${subscription.nextChargeDateDisplay} for ${subscription.nextChargeTotalInPayoutCurrencyDisplay}
                    </div> 
                </div>
                <div class='col-4'>
                    <div>
                        State: ${subscription.state}
                    </div>
                    <div>
                        ${cancelButton}
                    </div>
                </div>
            </div>
            <br>
            <br>
            <div class='row' style="padding-left: 15px;">
                <div class='col-4'>
                    <p> Base Product: &nbsp; <b> ${subscription.product} </b> </p>
                    <input id="baseInput-${subscription.id}" type="text">
                    <button class="btn btn-outline-info btn-sm" style="margin-bottom: 3px;" onclick="changeBaseProduct('${subscription.id}')"> Change </button>
                </div>
                <div class='col-4'>
                    <p> Quantity: &nbsp; ${subscription.quantity} </p>
                    <input type="number" min="1" id="quantityInput-${subscription.id}" type="text" style="max-width: 40px">
                    <button class="btn btn-outline-info btn-sm"  style="margin-bottom: 3px;" onclick="changeSubsQuantity('${subscription.id}')"> Change </button>
                </div>
            </div>
        </div>
    `);
}
