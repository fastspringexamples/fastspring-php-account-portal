<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Config\Definition\Exception\Exception;

use App\Utils\DBdriver;
use App\Utils\FSApi;
use App\Utils\Cryptor;

class MainController extends AbstractController
{

    public function login(Request $request) {
        $username = $request->request->get('username');
        $password = $request->request->get('password');
        $email = $request->request->get('email');
        if(!(isset($username) && isset($password) && isset($email))){
            return new Response('', 400);
        }
        // Try to retrieve data from API
        // This way we confirm that the credentials are correct
        $fsApi = new FSApi($username, $password);
        $accounts = $fsApi->get('accounts?email='.$email);
        // TODO handle proper error (is it credentials or email)?
        if (isset($accounts['error'])) {
            // Credentials invalid, notify user
            return new Response('Problem retrieving accounts, please check credentials', 400);
        }
        // Get accountId
        $accountId = $accounts['accounts'][0]['id'];
        // Create token
        $cryptor = new Cryptor();
        $token = $cryptor->encrypt($username.":".$password);
        // Return credentials in encrypted token
        return new JsonResponse(['success' => true, 'token' => $token, 'accountId' => $accountId]);
    }

    public function getAccountDetails(Request $request) {
        $username = "NHOLARM9RPSQFRANIDPLZG";// $request->request->get('username');
        $password = "gJ16aUlHSgqAo4BPuKHS6g";// $request->request->get('password');
        $accountId = "-U7g6WVOR3yRVvqjjKCryQ";
        
        if(!(isset($username) && isset($password) && isset($accountId))){
            return new Response('', 400);
        }
        $fsApi = new FSApi($username, $password);
        $account = $fsApi->get('accounts/'.$accountId);
        
        // Get all the orders for this account
        $orderIds = join(',', $account['orders']);
        $orders = $fsApi->get('orders/'.$orderIds);
        // TODO check orders are ok

        return new JsonResponse([
            'success' => true,
            'account' => $account,
            'orders' => $orders['orders']
        ]);
    }

    public function getAuthenticatedURL(Request $request) {
        $username = "NHOLARM9RPSQFRANIDPLZG";//$request->request->get('username');
        $password = "gJ16aUlHSgqAo4BPuKHS6g";//$request->request->get('password');
        $accountId = "-U7g6WVOR3yRVvqjjKCryQ";
        
        if(!(isset($username) && isset($password) && isset($accountId))){
            return new Response('', 400);
        }
        $fsApi = new FSApi($username, $password);
        $response = $fsApi->get('accounts/'.$accountId.'/authenticate');
        $account = $response['accounts'][0];
        if (isset($account['error'])) {
            return new JsonResponse([
                'success' => false,
                'error' => $account['error']
            ]);
        }
        return new JsonResponse([
            'success' => true,
            'url' => $account['url']
        ]);
    }


    public function getAccounts(Request $request)
    {
        $postData = json_decode($request->getContent(),true);
        $username = $postData['username'];
        $password = $postData['password'];
        if(!(isset($username) && isset($password))){
            return new Response('', 400);
        }
        // Try to retrieve data from API
        // This way we confirm that the credentials are correct
        $fsApi = new FSApi($username, $password);
        $accounts = $fsApi->get('accounts');
        if (isset($accounts['error'])) {
            // Credentials invalid, notify user
            return new Response('Problem retrieving accounts, please check credentials', 400);
        }
        // Retrieve all the accounts that have subscriptions
        $accountsInfo = array();
        foreach($accounts['accounts'] as $account) {
            $accountInfo = $fsApi->get('accounts/'.$account);
            if (sizeof($accountInfo['subscriptions']) > 0) {
                $accountsInfo[] = $accountInfo;
            }
        }
        // Return credentials in encrypted token
        return new JsonResponse(['success' => true, 'accounts' => $accountsInfo]);
    }

    // TODO only allow test ones (live === false)
    public function getCustomerSubscriptions(Request $request) {
        $username = "NHOLARM9RPSQFRANIDPLZG";
        $password = "gJ16aUlHSgqAo4BPuKHS6g";
        $postData = json_decode($request->getContent(),true);
        $subscriptionIds = $request->request->get('subscriptionIds');
        if(!(isset($username) && isset($password) && isset($subscriptionIds))){
            return new Response('', 400);
        }
        $fsApi = new FSApi($username, $password);
        $subscriptions = [];
        foreach($subscriptionIds as $subscriptionId) {
            $subscriptions[] = $fsApi->get('subscriptions/'.$subscriptionId);
        }
        return new JsonResponse(['success' => true, 'subscriptions' => $subscriptions]);
    }

    public function getCustomerOrders(Request $request) {
        $username = "NHOLARM9RPSQFRANIDPLZG";
        $password = "gJ16aUlHSgqAo4BPuKHS6g";
        $orderIds = $request->request->get('orderIds');
        
        if (!(isset($username) && isset($password) && isset($orderIds))){
            return new Response('', 400);
        }
        
        $fsApi = new FSApi($username, $password);
        $orders = [];
        foreach($orderIds as $orderId) {
            $orders[] = $fsApi->get('orders/'.$orderId);
        }
        return new JsonResponse(['success' => true, 'orders' => $orders]);
    }

    public function updateOrders(Request $request) {
        $username = "NHOLARM9RPSQFRANIDPLZG";
        $password = "gJ16aUlHSgqAo4BPuKHS6g";
        $orders = $request->request->all();
        
        if (!(isset($username) && isset($password) && isset($orders))){
            return new Response('', 400);
        }
        $fsApi = new FSApi($username, $password);
        $response = $fsApi->post('orders', $orders);
        return new JsonResponse(['success' => true, 'response' => $response]);
    }

    // Post the content from frontend
    public function updateSubscriptions(Request $request) {
        $username = "NHOLARM9RPSQFRANIDPLZG";
        $password = "gJ16aUlHSgqAo4BPuKHS6g";
        $subscriptions = $request->request->all();
        if(!(isset($username) && isset($password) && isset($subscriptions))){
            return new Response('', 400);
        }
        // Needed to send null values for uncanceling subscriptions
        if (isset($subscriptions["subscriptions"][0]["deactivation"])) {
            $subscriptions["subscriptions"][0]["deactivation"] = null;
        }
        $fsApi = new FSApi($username, $password);
        $response = $fsApi->post('subscriptions', $subscriptions);
        return new JsonResponse(['success' => true, 'response' => $response ]);
    }

    public function deleteSubscription(Request $request) {
        $username = "NHOLARM9RPSQFRANIDPLZG";
        $password = "gJ16aUlHSgqAo4BPuKHS6g";
        $subscriptionId = $request->attributes->get('subscriptionId');
        if(!(isset($username) && isset($password) && isset($subscriptionId))){
            return new Response('', 400);
        }
        $fsApi = new FSApi($username, $password);
        $response = $fsApi->delete('subscriptions/'.$subscriptionId);
        return new JsonResponse(['success' => true, 'response' => $response ]);
    }

    // TODO remove
    public function DRM(Request $request) {
        return new Response('Hey yo', 200);
    }
}

