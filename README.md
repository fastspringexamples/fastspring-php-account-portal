
# Custom Account Portal
This is an example implementation of a custom [Account Management Portal](https://docs.fastspring.com/customer-facing-account-management) using the [FastSpring API](https://docs.fastspring.com/integrating-with-fastspring/fastspring-api).
The backend is powered by the [Symfony](https://symfony.com) PHP framework.

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

## Deployment
Use the following command to deploy this app in a [Google Cloud Platform App Engine](https://cloud.google.com/appengine/) flexible instance:
```
gcloud app deploy
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


## App architecture
The code is structured in such a way that frontend and backend are fully decoupled using JSON REST API endpoints and AJAX calls, following a microservices approach.

### Logic layer
The backend acts as a middleware that interacts with the FastSpring API. It exposes similar endpoints to FastSpring's and uses a private token to interact with it. This token is an encrypted version of the credentials provided after a successful login.
Aside from checking the existance of the token, it also checks on the other required params for each endpoint and offers error handling so that it can properly be managed in the presentation layer. 

### Presentation layer
It's composed of static HTML pages that render the content dinamically with vanilla javascript.
For that purpose, the frontend is divived into three main modules:
- Apis: handles the interaction with the backend, ensuring the token is sent over.
- Renders: render the content of the page based on the data retrieved by the API.
- Utils: miscellaneous functions shared by multiple pages (e.g show loaders).

### Data layer
There isn't a proper data layer since everything is dynamically created from the API. The private token is the only piece of data that is temporarily stored accross the app. This token is stored in the user's brower using the [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).


## License
MIT
