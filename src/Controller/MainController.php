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

class MainController extends AbstractController
{
    public function getAccounts(Request $request)
    {

        $postData = json_decode($request->getContent(),true);
        $username = $postData['username'];
        $password = $postData['password'];
        if(!(isset($username) && isset($password))){
            return new Response('', 400);
        }
        
        $fsApi = new FSApi($username, $password);
        $accounts = $fsApi->get('accounts');
        if (isset($accounts['error'])) {
            return new Response('Problem retrieving accounts', 400);
        }
        $accountsInfo = array();
        foreach($accounts['accounts'] as $account) {
            $accountInfo = $fsApi->get('accounts/'.$account);
            if (sizeof($accountInfo['subscriptions']) > 0) {
                $accountsInfo[] = $accountInfo;
            } 
        }
        return new JsonResponse(['success' => true, 'accounts' => $accountsInfo]);
    }

    public function getAccountDetails(Request $request) {
        $username = "NHOLARM9RPSQFRANIDPLZG";//$request->request->get('username');
        $password = "gJ16aUlHSgqAo4BPuKHS6g";//$request->request->get('password');
        $accountId = "-U7g6WVOR3yRVvqjjKCryQ";
        
        if(!(isset($username) && isset($password) && isset($accountId))){
            return new Response('', 400);
        }
        $fsApi = new FSApi($username, $password);
        $account = $fsApi->get('accounts/'.$accountId);
        return $account;
    }

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
        
        if (!(isset($username) && isset($password) && isset($orders))){
            return new Response('', 400);
        }
        $orders = [];
        foreach($orderIds as $orderId) {
            $orders[] = $fsApi->get('orders/'.$orderId);
        }
        return $orders;
    }

    // Post the content from frontend
    public function updateSubscription(Request $request) {
        $username = "NHOLARM9RPSQFRANIDPLZG";
        $password = "gJ16aUlHSgqAo4BPuKHS6g";
        $subscriptions = $request->request->all();
        if(!(isset($username) && isset($password) && isset($subscriptions))){
            return new Response('', 400);
        }
        $fsApi = new FSApi($username, $password);
        $response = $fsApi->post('subscriptions', $subscriptions);
        return new JsonResponse(['success' => true, 'response' => $response ]);
    }
}

