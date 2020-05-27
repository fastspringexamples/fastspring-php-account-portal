<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Config\Definition\Exception\Exception;

use App\Utils\FSApi;
use App\Utils\Cryptor;
use App\Utils\AuthRequest;

/*
 *  Controller class for the /accounts endpoint
 */
class AccountController extends AbstractController
{
    public function login(Request $request) {
        try {
            $username = $request->request->get('username');
            $password = $request->request->get('password');
            $email = $request->request->get('email');
            if(!(isset($username) && isset($password) && isset($email))){
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Missing params in request'
                ]);
            }
            
            // If user has chosen login with fastspringexamples store
            // we set these variables to its API credentials
            // Heads-up: These credentials won't be accessible for local development!
            if ($username === 'fastspringexamples' &&
                $password === 'fastspringexamples') {
                $username = getenv('FS_USERNAME') ?? 'fake';
                $password = getenv('FS_PASSWORD') ?? 'fake';
            }

            // Try to retrieve data from API
            // This way we confirm that the credentials are correct
            $credentials = array(
                'username' => $username,
                'password' => $password
            );
            $fsApi = new FSApi($credentials);
            $accounts = $fsApi->get('accounts?email='.$email);

            // Check that this buyer's email exists
            if (!isset($accounts) || isset($accounts['error'])) {
                return new JsonResponse([
                    'success' => false,
                    'error' => $accounts['error']['email']
                ]);
            }
            // Get accountId
            $accountId = $accounts['accounts'][0]['id'];
            // Create token
            $cryptor = new Cryptor();
            $token = $cryptor->encrypt($username.":".$password);
            // Return credentials in encrypted token
            return new JsonResponse(['success' => true, 'token' => $token, 'accountId' => $accountId]);
        } catch (Exception $e) {
            return new JsonResponse(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function getAccountDetails(Request $request) {
        try {
            // Check credentials from URL
            $credentials = AuthRequest::getCredentials($request);
            $accountId = $request->request->get('accountId');
            
            if (!isset($accountId)) {
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Missing params in request'
                ]);
            }
            // Get account information from API
            $fsApi = new FSApi($credentials);
            $account = $fsApi->get('accounts/'.$accountId);
            
            // Get all the orders for this account
            $orders = [];
            if (count($account['orders']) > 0) {
                $orderIds = join(',', $account['orders']);
                $orders = $fsApi->get('orders/'.$orderIds)['orders'];
            }
            
            
            // Filter out to only allow for test orders
            $orders = array_filter($orders, function($order) {
                return !$order['live'];
            });

            // the previous filter has transformed the array into an associative one
            // we need to reverse it to numerical by taking their values
            $orders = array_values($orders);
            
            return new JsonResponse([
                'success' => true,
                'account' => $account,
                'orders' => $orders
            ]);
        } catch (Exception $e) {
            return new JsonResponse(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function getAuthenticatedURL(Request $request) {
        try {
            $credentials = AuthRequest::getCredentials($request);
            $accountId = $request->request->get('accountId');
            
            if(!isset($accountId)){
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Missing params in request'
                ]);
            }
            $fsApi = new FSApi($credentials);
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
        } catch (Exception $e) {
            return new JsonResponse(['success' => false, 'error' => $e->getMessage()]);
        }
    }
}
