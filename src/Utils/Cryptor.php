<?php

namespace App\Utils;

/* 
 * This cryptor offers a basic two-way encryption for vendor's private API credentials.
 * On login the credentials will be sent back encrypted and stored in browser's localStorage.
 * Subsequent calls will send this token over so it gets descripted to query FastSpring API.
 *
 * Acknolewdge  https://www.the-art-of-web.com/php/two-way-encryption/
 */

class Cryptor
{

    const METHOD = 'aes-128-ctr'; // default cipher method if none supplied
    const KEY = "96bc-Zf%y9;CDeQn";

    public function __construct()
    {
        $this->key = self::KEY;
        $this->method = self::METHOD;
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
?>




