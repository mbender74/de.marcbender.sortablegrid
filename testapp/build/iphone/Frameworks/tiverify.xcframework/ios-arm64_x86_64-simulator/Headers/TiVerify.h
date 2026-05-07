/**
 * testapp SDK
 * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */

#import <Foundation/Foundation.h>

/**
 * Decrypts a range of data from an encrypted blob using the provided key and IV.
 *
 * The key and IV are derived at runtime from seed arrays using SHA-256,
 * not embedded in the data blob.
 *
 * @param thedata  The XOR-unmasked encrypted data blob
 * @param range    The range within thedata to decrypt
 * @param key      Pointer to the 16-byte AES-128 decryption key
 * @param iv       Pointer to the 16-byte AES-128 IV
 * @return         Decrypted data, or empty NSData on failure
 */
NSData *filterDataInRange(NSData *thedata, NSRange range, const void *key, const void *iv);