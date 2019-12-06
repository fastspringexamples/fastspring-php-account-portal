<?php

namespace App\Utils;

/* 
 * This cryptor offers a basic two-way encryption for vendor's private API credentials.
 * On login the credentials will be sent back encrypted and stored in browser's sessionStorage.
 * Subsequent calls will send this token over so it gets descripted to interact with the FastSpring API.
 *
 * Acknolewdge  https://www.the-art-of-web.com/php/two-way-encryption/
 */

class Cryptor
{

    public function __construct()
    {
        // For local development we'll use a dummy secret 'my-secret'
        $this->key = getenv('KEY_SECRET') ||'my-secret';
        $this->method = 'aes-128-ctr';
    }

    protected function iv_bytes()
    {
        return openssl_cipher_iv_length($this->method);
    }

    public function encrypt($data)
    {
        $iv = openssl_random_pseudo_bytes($this->iv_bytes());
        return bin2hex($iv) . openssl_encrypt($data, $this->method, $this->key, 0, $iv);
    }

    // decrypt encrypted string
    public function decrypt($data)
    {
        $iv_strlen = 2  * $this->iv_bytes();
        if(preg_match("/^(.{" . $iv_strlen . "})(.+)$/", $data, $regs)) {
            list(, $iv, $crypted_string) = $regs;
            if(ctype_xdigit($iv) && strlen($iv) % 2 == 0) {
                return openssl_decrypt($crypted_string, $this->method, $this->key, 0, hex2bin($iv));
            }
        }
        return FALSE; // failed to decrypt
    }
}
