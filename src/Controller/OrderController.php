<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

use App\Utils\FSApi;
use App\Utils\Cryptor;
use App\Utils\AuthRequest;

/*
 *  Controller class for the /orders endpoint
 */

class OrderController extends AbstractController
{
    public function getCustomerOrders(Request $request) {
        $credentials = AuthRequest::getCredentials($request);
        $orderIds = $request->request->get('orderIds');
        
        if (!isset($orderIds)){
            return new Response('', 400);
        }
        
        $fsApi = new FSApi($credentials);
        $orders = [];
        if (count($orderIds) > 0) {
            $ids = join(',', $orderIds);
            $orders = $fsApi->get('orders/'.$ids)['orders'];
        }
        // Check that this buyer's email exists
        if (isset($orders[0]['error'])) {
            return new JsonResponse([
                'success' => false,
                'error' => $orders[0]['error']['order']
            ]);
        }

        // Filter out to only allow for test orders
        $orders = array_filter($orders, function($order) {
            return !$order['live'];
        });
        
        return new JsonResponse(['success' => true, 'orders' => $orders]);
    }

    /*
     *  It forwards the POST data sent by the client to the /orders endpoint, primarily for updating custom order tags
     */
    public function updateOrders(Request $request) {
        $credentials = AuthRequest::getCredentials($request);
        $orders = $request->request->all();
        
        if (!(isset($orders))){
            return new Response('', 400);
        }
        $fsApi = new FSApi($credentials);
        $response = $fsApi->post('orders', $orders);
        return new JsonResponse(['success' => true, 'response' => $response]);
    }
}
