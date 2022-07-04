import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';
// import { IOS_IN_APP_SECRET_KEY, IS_PROD } from '../config';


export const initiateConnection = () => {
  RNIap.initConnection().catch(() => {
    console.log("Error connectiong")
  }).then(() => {
    console.log("Connected to Store")
  })
}

export const restorePurchases = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const purchases = await RNIap.getPurchaseHistory()
      const purchasedItem = purchases.find(purchase => purchase.productId === productId)
      if (purchasedItem) {
        if (Platform.OS === 'ios') {
          const receiptData = await validateReceipt(purchasedItem.transactionReceipt)
          if (receiptData?.status === 0) {
            const inAppReceipts = receiptData.receipt?.in_app
            let itemReceipt = inAppReceipts?.find(appReceipt => appReceipt.product_id === productId)
            if (!itemReceipt) {
              const receiptsInfo = receiptData.latest_receipt_info
              itemReceipt = receiptsInfo.find(receipt => receipt.product_id === productId)
            }
            resolve([{
              itemReceipt,
              restoredItem: purchasedItem
            }])
          }
          else {
            const error = new Error('receiptInvalid')
            reject(error);
          }
        } else {
          resolve([{
            itemReceipt: null,
            restoredItem: purchasedItem
          }])
        }
      }
      else {
        resolve([])
      }
    }
    catch (error) {
      reject(error);
    }
  })
}

export const getInAppSubscriptions = (productIds) => {
  return new Promise((resolve, reject) => {
    try {
      RNIap.initConnection().catch((err) => {
        console.log("Error connecting", err)
      }).then(() => {
        console.log("Connected to Store")
        RNIap.getSubscriptions(productIds).catch((err) => {
          console.log("Error Finding Subscriptions", err)
        }).then((res) => {
          console.log("Subscriptions:", res)
          return res
        })
      })

    }
    catch (error) {
      console.log("error", error)
      reject(error);
    }
  })
}

export const buySubscription = async (product) => {
  return new Promise(async (resolve, reject) => {
    try {
      const purchases = await RNIap.getPurchaseHistory()
      const purchasedItem = purchases.find(purchase => purchase.productId === product.productId)
      if (purchasedItem) {
        const _error = new Error('productPurchased')
        reject(_error);
        return;
      }
      await RNIap.requestPurchase(product.productId, false)
      RNIap.purchaseUpdatedListener((purchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          RNIap.finishTransaction(purchase, false)
          resolve(purchase)
        }
      });

      RNIap.purchaseErrorListener((error) => {
        reject(error)
      });
    }
    catch (error) {
      reject(error);
    }
  })
}

// const validateReceipt = async (receipt) => {
//   try {
//     const receiptBody = {
//       "receipt-data": receipt,
//       "password": IOS_IN_APP_SECRET_KEY
//     }
//     const isTest = IS_PROD ? false : true
//     return await RNIap.validateReceiptIos(receiptBody, isTest)
//   }
//   catch (error) {
//     return null;
//   }
// }
