<?php

namespace App\Utils;

use Symfony\Component\Config\Definition\Exception\Exception;

/* Custom utility to perform GET request to the FastSpring API
 * https://docs.fastspring.com/integrating-with-fastspring/fastspring-api
 */
class FSApi

{
    /* These credentials point to the fastspringexamples store. To
     * To put to your personal store, you'll need replace with your own credentials
     * https://docs.fastspring.com/integrating-with-fastspring/fastspring-api#FastSpringAPI-accessing
    */
    //const USERNAME = "NHOLARM9RPSQFRANIDPLZG";
    //const PASSWORD ="gJ16aUlHSgqAo4BPuKHS6g";

    function __construct($username, $password ) {
		$this->username = $username;
		$this->password = $password;
    }

    public function get($params){
        $url = "https://api.fastspring.com/";
        if ($params) {
            $url .= $params;
        }
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_USERPWD, $this->username.":".$this->password);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        $response = curl_exec($ch);
        if ($response === false) {
            $err = curl_error($ch);
            throw new Exception($err);
        }
        curl_close($ch);
        return json_decode($response, true);
    }

    public function post($params, $body){
        $url = "https://api.fastspring.com/";
        if ($params) {
            $url .= $params;
        }
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_USERPWD, $this->username.":".$this->password);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        $response = curl_exec($ch);
        if ($response === false) {
            $err = curl_error($ch);
            throw new Exception($err);
        }
        curl_close($ch);
        return json_decode($response, true);
    }

}
?>


