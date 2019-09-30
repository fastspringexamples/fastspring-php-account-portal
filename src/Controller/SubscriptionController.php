<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

use App\Utils\FSApi;
use App\Utils\Cryptor;
use App\Utils\AuthRequest;

class SubscriptionController extends AbstractController
{
    // This has been limited to one subscription only
    public function getCustomerSubscriptions(Request $request) {
        try {
            $credentials = AuthRequest::getCredentials($request);
            $subscriptionIds = $request->request->get('subscriptionIds');
            if(!isset($subscriptionIds)){
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Missing subscriptionId param in request'
                ]);
            }
            $fsApi = new FSApi($credentials);
            $subscriptions = [];
            foreach($subscriptionIds as $subscriptionId) {
                $subscriptions[] = $fsApi->get('subscriptions/'.$subscriptionId);
            }
            // Check that this buyer's email exists
            if (isset($subscriptions[0]['error'])) {
                return new JsonResponse([
                    'success' => false,
                    'error' => $subscriptions[0]['error']['subscription']
                ]);
            }
            return new JsonResponse(['success' => true, 'subscriptions' => $subscriptions]);
        } catch (Exception $e) {
            return new JsonResponse(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function updateSubscriptions(Request $request) {
        try {
            $credentials = AuthRequest::getCredentials($request);
            $subscriptions = $request->request->all();
            if(!(isset($subscriptions))){
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Missing payload in request'
                ]);
            }
            // Needed to send null values for uncanceling subscriptions
            if (isset($subscriptions["subscriptions"][0]["deactivation"])) {
                $subscriptions["subscriptions"][0]["deactivation"] = null;
            }
            $fsApi = new FSApi($credentials);
            $response = $fsApi->post('subscriptions', $subscriptions);
            
            if ($response === null) {
                new JsonResponse(['success' => false, 'error' => 'Request not valid']);
            } else if (isset($response['subscriptions'][0]['error'])) {
                return new JsonResponse(['success' => false, 'error' => $response['subscriptions'][0]['error'] ]);
            }
            return new JsonResponse(['success' => true, 'response' => $response ]);
        } catch (Exception $e) {
            return new JsonResponse(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function deleteSubscription(Request $request) {
        try {
            $credentials = AuthRequest::getCredentials($request);
            $subscriptionId = $request->attributes->get('subscriptionId');
            if(!(isset($subscriptionId))){
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Missing subscriptionId in request'
                ]);
            }
            $fsApi = new FSApi($credentials);
            $response = $fsApi->delete('subscriptions/'.$subscriptionId);
            return new JsonResponse(['success' => true, 'response' => $response ]);
        } catch (Exception $e) {
            return new JsonResponse(['success' => false, 'error' => $e->getMessage()]);
        }
    }


}
