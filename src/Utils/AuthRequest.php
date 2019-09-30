<?php

namespace App\Utils;

use Symfony\Component\Config\Definition\Exception\Exception;

use App\Utils\Cryptor;

/* Helper to check and retrieve encrypted credentials
 * from requests.
 */

class AuthRequest
{
    public function getCredentials($request) {
        $token = $request->request->get('token');
        $cryptor = new Cryptor();
        $credentials = $cryptor->decrypt($token);
        $credentialsArr = explode(":", $credentials);
        if (count($credentialsArr) !== 2) {
            throw new Exception('API credentials not provided');
        }
        return array(
            'username' => $credentialsArr[0],
            'password' => $credentialsArr[1]
        );
    }
}
?>


