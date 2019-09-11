function renderModalTags(order) {
    let tags = 'No tags';
    if (order.tags && Object.keys(order.tags).length > 0) {
        tags = Object.keys(order.tags).map((key) => (
            `<span> ${key} : ${order.tags[key]} </span>`
        )).join('');
    }

    return (`
        <div class='row'>
            <div style="text-align: center" class="col">
            <h5 > Custom Tags </h5>
            <div class='card' style="width: 50%; margin: auto">
                ${tags}
            </div>
            <br>
            <button
                class="btn btn-outline-info btn-sm"
                data-toggle="modal"
                data-target="#tagsModal"
            >
                Update tags
            </button>
            </div>
        </div>
        <div class="modal fade" id="tagsModal" tabindex="-1" role="dialog" aria-labelledby="tagsModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-sm" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel"> Custom tags </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id='customTagsForm'>
                                <div class="form-label-group">
                                    <input type="text" class="form-control" name="tagKey" id="tagKey" required>
                                    <label for="tagKey"> Tag </label>
                                </div>
                                <div class="form-label-group">
                                    <input type="text" class="form-control" name="tagValue" id="tagValue" required>
                                    <label for="tagValue"> Value </label>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal"> Cancel </button>
                            <button type="button" class="btn btn-primary" onclick='createOrderTags()'> Update tags</button>
                        </div>
                    </div>
                </div>
            </div>
    `);
    
        /*
    return (`
        <div class='row'>
            <div class="col"> 
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">Key</th>
                      <th scope="col">Val</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                        <td> Tag1 </td>
                        <td> val1 </td>
                        
                    </tr>
                  </tbody>
                  </table>
                    <button
                class="btn btn-outline-info btn-sm"
                data-toggle="modal"
                data-target="#tagsModal"
            >
                Update tags
            </button>
            </div>
        </div>
    `);
    */

}

function renderCustomTags(order) {
    let tags = 'No tags';
    if (order.tags && Object.keys(order.tags).length > 0) {
        tags = Object.keys(order.tags).map((key) => (
            `<span> ${key} : ${order.tags[key]} </span>`
        )).join('');
    }

    return (`
        <div class='row'>
            <h5> Tags </h5>
        </div>
        <div class='row'>
            <div class="col-5">
                <form id='customTagsForm'>
                    <div class="form-label-group">
                        <input type="text" class="form-control" name="tagKey" id="tagKey">
                        <label for="tagKey">Tag</label>
                    </div>
                    <div class="form-label-group">
                        <input type="text" class="form-control" name="tagValue" id="tagValue">
                        <label for="tagValue">Value</label>
                    </div>
                </form>
                <button class="btn btn-outline-info btn-sm" style="margin-bottom: 3px;" onclick="createOrderTags('${order.id}')"> Add </button>
            </div>
            <div class="col-7">
                ${tags}
            </div>
        </div>
    `);
}

function renderProductFulfillments(item) {
    let fulfillmentsItems = [];
    if (item.fulfillments && Object.keys(item.fulfillments).length > 0) {
        // TODO fulfillments
        fulfillmentsItems = Object.keys(item.fulfillments).map((key) => {
            const fulfilment = item.fulfillments[key][0];
            return (`
                    <div>
                    ${fulfilment !== 'instructions' ?
                            `
                        ${fulfilment.type === 'license' ?
                                `
                            <div class='license '>
                                <ul>
                                    <li> <span> License "${fulfilment.display}": <span> </li>
                                    <ul>
                                        <li> ${fulfilment.license} </li>
                                    </ul>
                                </ul>
                            </div>
                            `
                                :
                            `
                            <div class='file '>
                                <ul>
                                    <li> File <a href="${fulfilment.file}" target="_blank"> "${fulfilment.display}" </a>  (${fulfilment.size} bytes)</li>
                                </ul>
                            </div>
                            `
                        }
                        `
                            :
                        `
                            <div class='instructions'>
                                ${fulfilment}
                            </div>
                        `
                    }
                    </div>
            `);
        });
    }
    return (`
        <div class='fulfillments'>
            <h5> Fulfillments </h5>
            ${fulfillmentsItems.length > 0 ?
                    fulfillmentsItems.join('') :
                `
                    There are no fulfillments associated to this item
                `
            }
        </div>
    `);
}

function renderProductAttributes(item) {
    let attributes = '';
    if (item.attributes && Object.keys(item.attributes).length > 0) {
        const attributesItems = Object.keys(item.attributes).map((key) => (
            `<span> ${key} : ${item.attributes[key]} </span>`
        ));
        attributes = (`
            <div class='attributes'>
                ${attributesItems.join('')}
            </div>
        `);
    }
    const productPath = item.product;
    return (`
        <div class='row'>
            <div style="text-align: center" class="col">
            <h5> Product attributes  </h5>
            <div class='card' style="width: 50%; margin: auto">
                ${attributes}
            </div>
            <br>
            <button
                class="btn btn-outline-info btn-sm"
                data-toggle="modal"
                data-target="#attributesModal"
            >
                Update attributes
            </button>
            </div>
        </div>
        <div class="modal fade" id="attributesModal" tabindex="-1" role="dialog" aria-labelledby="attributesModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-sm" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel"> Product attributes </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id='productAttrForm-${productPath}'>
                                <div class="form-label-group">
                                    <input type="text" class="form-control" name="attrKey" id="attrKey-${productPath}">
                                    <label for="attrKey"> Key </label>
                                </div>
                                <div class="form-label-group">
                                    <input type="text" class="form-control" name="attrValue" id="attrValue-${productPath}">
                                    <label for="attrValue"> Value </label>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal"> Cancel </button>
                            <button type="button" class="btn btn-primary" onclick='createProductAttributes('${productPath}')'> Update attributes</button>
                        </div>
                    </div>
                </div>
            </div>

    `);
}

function renderOrderItems(item) {
    // Render product fulfillments
    const fulfillments = renderProductFulfillments(item);
    // Render product attributes
    const attributes = renderProductAttributes(item);
    return (`
        <div class='card itemContainer'>
            <div class='row'>
            <div class='col-4'>
                <h5> Item details </h5>
                <ul>
                <li> Product Id: <b> ${item.product} </b> </li>
                <li> Product display: <b> ${item.display} </b> </li>
                <li> Quantity: <b> ${item.quantity} </b></li>
                <li> Total: <b> ${item.subtotalDisplay} </b> </li>
                ${item.subscription ? `
                        <li> <a class='fs-link' onclick="goToSubscription('${item.subscription}')"> Link to subscription </a> </li>
                `: ''
                }
                </ul>
            </div>
            <div class='col-4'>
                ${fulfillments || ''}
            </div>
            <div class='col-4'>
                ${attributes || ''}
            </div>
            </div>
        </div>
    `);
}

function renderOrder(order) {
    // Render Order Custom tags
    const customTags = renderModalTags(order);
    // Render order items
    const orderItems = order.items.map(renderOrderItems);

    // Check if order has been returned
    let returns = '';
    if (order.returns && order.returns.length > 0) {
        returns = order.returns.map((ret) => (`
            <div class='return'>
                <p> Return: </p>
                <span> ${ret.amount} </span>
                <span> ${ret.return} </span>
            </div>
        `)).join('');
    }
    return (`
            <div class='container'>
                <div class="spinner-border fs-spinner hide" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <div class='row' style="border-bottom: 1px solid; text-align: center; padding: 5px; background-color: #17a2b8!important; font-weight: bold;">
                    <div class='col-4'>
                         <span> Order Id: ${order.id} <span>
                    </div>
                    <div class='col-4'>
                         <span> Reference Id: ${order.reference} <span>
                    </div>
                    <div class='col-4'>
                         <span> Order Completed: ${order.completed} <span>
                    </div>
                </div>
                <div class='row' style="padding-top: 20px;">
                    <div class='col-4'>
                        <div class='row'>
                            <div class='col-6 textCentered'>
                                Price
                            </div>
                            <div class='col-6'>
                                ${order.totalDisplay}
                            </div>
                        </div>
                        <div class='row'>
                            <div class='col-6 textCentered'>
                                Tax
                            </div>
                            <div class='col-6'>
                                ${order.taxDisplay}
                            </div>
                        </div>
                        <div class='row'>
                            <div class='col-6 textCentered'>
                                Discount
                            </div>
                            <div class='col-6'>
                                ${order.discountDisplay}
                            </div>
                        </div>
                        <div class='row'>
                            <div class='col-6 textCentered' style="padding-right: 0">
                                <span style="border-top: 1px solid blue; padding: 1px 15px;"> Subtotal </span>
                            </div>
                            <div class='col-6'  style="padding-left: 0">
                                <span style="border-top: 1px solid blue; padding: 1px 15px;"> ${order.subtotalDisplay} </span>
                            </div>
                        </div>
                        ${returns}
                    </div>
                    <div class='col-3'>
                        <div class='row'>
                            Payment type: ${order.payment.type}
                        </div>
                        <div class='row'>
                            Card Ending: ${order.payment.cardEnding}
                        </div>
                        <div class='row'>
                            <a href="${order.invoiceUrl}" target="_blank"> Invoice </a>
                        </div>
                    </div>
                    <div class='col-5'>
                        ${customTags || ''}
                    </div>
                </div>
                <div>
                <br>
                <br>
                <div class='orderItems'>
                <ul class="nav nav-tabs" style="border-bottom: 0;">
                <li class="nav-item nav-link active" style="margin-top: 20px;font-size: large; font-weight: bold; border-bottom: 1px solid gainsboro">
                    Order Items
                </li>
            </ul>
                 ${orderItems.join('')}
                </div>
            </div>
    `);
}
