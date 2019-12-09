
# Custom Account Portal
This is an example implementation of a custom [Account Management Portal](https://docs.fastspring.com/customer-facing-account-management) using the [FastSpring API](https://docs.fastspring.com/integrating-with-fastspring/fastspring-api).
The backend is powered by the [Symfony](https://symfony.com) PHP framework.

Please note that this example aims to serve as a reference and not as a production ready application.

## Demo
You can acess a live demo [here](https://fs-accountportal.appspot.com/login.html).

## Requirements

- PHP 7.1 or higher.
- [Composer](https://getcomposer.org/)

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
On every page, at the top right corner there is a Help button. Use to this button to understand how the current content that you see has been implemented. Here is the information for each page:

#### Login Page
There are two options to log into the portal:
- You log in on your own store: to do that you need to input your store's API credentials and a buyer's email.
- You log in on fastspringexamples store by providing only buyer's email (API credentials will be automatically applied).
These credentials will be used along with the application to interact with the API on your behalf in order to retrieve and update buyer's account data such as orders and subscriptions.
If the data provided is correct, a tokenized version of these credentials will be generated and used throughout the application.

#### Account page
In this page we are querying the [accounts](https://community.fastspring.com/s/article/accounts) endpoint to display the buyer's information.
In order for buyers to update their payment method, they need to visit the [Account Management Portal](https://community.fastspring.com/s/article/Customer-Facing-Account-Management). You can obtain a temporary [authenticated link](https://community.fastspring.com/s/article/Customer-Facing-Account-Management#Customer-FacingAccountManagement-ProvidingCustomerswithPre-AuthenticatedAccountManagementLinks) to the buyer's account in the portal through the API.
Among the account data returned by the API there is an array of orderIds which we will use to query the [orders](https://community.fastspring.com/s/article/orders) endpoint to show a one-liner description of each of them.
The 'Create Order' green button allows you to [charge a new order](https://community.fastspring.com/s/article/orders#UpdateOrderTagsandAttributes) to the current account. In order for this to work, there needs to be an active subscription so that FastSpring can charge the payment method on file.

#### Order page
This page shows information about a particular order retrieved through the [orders](https://community.fastspring.com/s/article/orders) endpoint. At the left hand side there is payment information and a link to its corresponding invoice.
Next to it, there is a form to update its [custom tags](https://community.fastspring.com/s/article/Passing-and-capturing-custom-order-tags-and-product-attributes). At the bottom, the order items are displayed. The order items contain basic information about the product, its [fulfillments](https://community.fastspring.com/s/article/Fulfillments) and a form to update
its [attributes](https://community.fastspring.com/s/article/Passing-and-capturing-custom-order-tags-and-product-attributes).
If the order refers to a subscription a link to its subscription page is shown.

#### Subscription page
This page shows information about a particular subscription retrieved through the [subscriptions](https://community.fastspring.com/s/article/subscriptions) endpoint.
At the right hand side there is a button to cancel/uncancel the subscription.
If the subscription is active, two forms at the bottom will appaear to upgrade/downgrade the subscription by changing the base product and quantity.


## App architecture
The code is structured in such a way that frontend and backend are fully decoupled using JSON REST API endpoints and AJAX calls, following a microservices approach.

### Logic layer
The backend acts as a middleware that interacts with the FastSpring API. It exposes similar endpoints to FastSpring's and uses a private token to interact with it. This token is an encrypted version of the credentials provided after a successful login.
Aside from checking the existance of the token, it also checks other required params for each endpoint. It does error handling so that it can properly be managed in the presentation layer. 

### Presentation layer
It's composed of static HTML pages that render the content dinamically with vanilla javascript and some JQuery.
For that purpose, the frontend is divived into three main modules:
- Apis: handles the interaction with the backend, ensuring the token is sent over.
- Renders: render the content of the page based on the data retrieved by the API.
- Utils: miscellaneous functions shared by multiple pages (e.g show loaders).

### Data layer
There isn't a proper data layer since everything is dynamically created from the API. The private token is the only piece of data that is temporarily stored accross the app. This token is stored in the user's browser using the [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).


## License
MIT
