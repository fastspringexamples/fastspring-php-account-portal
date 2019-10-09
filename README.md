# Custom Account Portal
This is an example implementation of a custom [Account Management Portal](https://docs.fastspring.com/customer-facing-account-management) using the [FastSpring API](https://docs.fastspring.com/integrating-with-fastspring/fastspring-api).
The backend is powered by the [Symfony](https://symfony.com) PHP framework.

## Requirements

PHP 7.1 or higher.
[Composer](https://getcomposer.org/)

## Installation
Install application with composer:
```
composer install
```

You can use PHP’s built-in [web server](https://symfony.com/doc/current/setup/built_in_web_server.html) to start it up:
```
php bin/console server:start
```

## Usage
At the top right corner there is a Help button.

This button opens up a popup containing information about the current page, as follows: 

#### Login Page
To log into the portal you need to input your store's API credentials and a buyer's email. These credentials will be used along the application to interact with the API on your behalf and retrieve and update buyer's account data such as orders and subscriptions. If the data provided is correct a token will be generated which will be used along the application to interact with the FastSpring API.

#### Account page
In this page we are querying the [accounts](https://docs.fastspring.com/integrating-with-fastspring/fastspring-api/accounts) endpoint to display buyer's information.
In order for buyers to update their payment method they need to visit the [Account Management Portal](https://docs.fastspring.com/customer-facing-account-management). You can obtain a temporary [authenticated link](https://docs.fastspring.com/integrating-with-fastspring/fastspring-api/accounts#id-/accounts-GetauthenticatedaccountmanagementURL) to the buyer's account in the portal through the API.
Among the account data returned by the API there is an array of orderIds which we will use to query the [orders](https://docs.fastspring.com/integrating-with-fastspring/fastspring-api/orders) endpoint to show a one-liner description of each of them.

#### Order page
This page shows information about a particular order retrieved through the [orders](https://docs.fastspring.com/integrating-with-fastspring/fastspring-api/orders) endpoint. At the left hand side there is payment information and a link to its corresponding invoice.
Next to it there is a form to update its [custom tags](https://docs.fastspring.com/integrating-with-fastspring/passing-and-capturing-custom-order-tags-and-product-attributes). At the bottom the order items are displayed, they contain basic information about the product, its [fulfillments](https://docs.fastspring.com/products-bundles-and-subscriptions/fulfillments) and a form to update
its [attributes](https://docs.fastspring.com/integrating-with-fastspring/passing-and-capturing-custom-order-tags-and-product-attributes).
If the order refers to a subscription a link to its subscription page is shown.

#### Subscription page
This page shows information about a particular subscription retrieved through the [orders](https://docs.fastspring.com/integrating-with-fastspring/fastspring-api/subscriptions) endpoint.
At the right hand side there is button to cancel/uncancel the subscription.
At the bottom there are two forms to upgrade/downgrade the subscription by changing the base product and quantity.

## License
MIT
