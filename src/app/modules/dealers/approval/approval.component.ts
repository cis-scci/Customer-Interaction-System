import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import { HandelError , Dealer } from '../../../shared/enumrations/app-enum.enumerations';
import { ActivatedRoute, Params } from '@angular/router';
import { GlobalRestService } from '../../../services/rest/global-rest.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit {

  loader: boolean = false;
  productDetailLoader: boolean = false;
  phone: string = "";
  paymentType : string = "";
  dealerName : string = "";
  dealerId : string;
  categories : any = [];
  products : any = [];
  orderItems : any = [];
  calculateNetPayableDetails : any = [];
  selectedCalculateNetPayableDetails : any = [];

  constructor(private toastr: ToastrService,private restService: GlobalRestService,private primaryHeader: PrimaryHeaderService,private route: ActivatedRoute) { }

  ngOnInit() {
        //setting page title
        this.primaryHeader.pageTitle.next("Dealer Cart");
        this.primaryHeader.dealerName.subscribe(value => this.dealerName = value);
        this.route.params.subscribe((params: Params) => {
          this.dealerId = params['id'];
          this.phone =  params['phone'];
          this.getCategory();    
        }, error => {
          console.error('Error: ', error);
        });    
  }

  getCategory(){
    this.loader = true;
    // call api code here...
    
    let requestObj = {
      "DealerID": this.dealerId,
      "Name": "",
      "IsAddOn": "",
      "DeviceID": "",
      "EMail": "",
      "LanguageID": "",
      "DealerTypeID": "",
      "PhoneNo": ""
    };

    this.restService.HttpPostParams = requestObj;
    this.restService.ApiEndPointUrlOrKey = Dealer.getProductCategory;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;          
    this.restService.callApi()
      .subscribe(
      (sucessResponse => {     
        //console.log(sucessResponse)
        if(sucessResponse.rs == 0){
          this.categories = sucessResponse.data.Category;
          this.loader = false;
          this.getProducts(0);
        }
      }),
      (err => {
        this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
        this.loader = false;
      })
      );
  }

  getProducts(productCategoryId){
    this.productDetailLoader = true;
    // call api code here...
    
    let requestObj = {
      "ProductUseTypeID": 0,
      "ProductCategoryTypeID": productCategoryId,
      "OrderPaymentTypeID": 0,
      "PaymentTypeInstalmentID": 0,
      "ProductGroupID": null,
      "FlashSaleID": 0,
      "ProductID": null,
      "UseWalletPoints": false,
      "IsFavouriteProduct": false,
      "dealer": {
          "DealerID": this.dealerId,
          "Name": "",
          "IsAddOn": false,
          "DeviceID": "",
          "EMail": "",
          "LanguageID": "",
          "DealerTypeID": "",
          "PhoneNo": ""
      },
      "orderItems": []
    };

    this.restService.HttpPostParams = requestObj;
    this.restService.ApiEndPointUrlOrKey = Dealer.getProducts;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;          
    this.restService.callApi()
      .subscribe(
      (sucessResponse => {     
        //console.log(sucessResponse)
        if(sucessResponse.rs == 0){
          this.products = sucessResponse.data;
          this.products.forEach(element => {
            element["quantity"] = 0;
          });
          console.log(this.products.length);
          this.productDetailLoader = false;
        }
      }),
      (err => {
        this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
        this.productDetailLoader = false;
      })
      );
  }

  changeCategory(item){
    if(item.tab.textLabel == 'All'){
      this.getProducts(0);
    }
    else{            
      let productCategoryId = this.categories.filter(resp => {return resp.ProductCategoryTypeName == item.tab.textLabel })[0].ProductCategoryTypeID;
      this.getProducts(productCategoryId);
    }
    
  }

  addToCart(product,productQuantity){
    console.log(product)
    product.quantity = Number(productQuantity) + 1;

    let  orderItems =
          {
              "ProductID": product.ProductID,
              "ProductSize": product.ProductSize,
              "ProductType": product.ProductType,
              "Colour": product.Colour,
              "ColorCode": product.ColorCode,
              "ProductImageURL": product.ProductImageURL,
              "NoOfUnits": product.NoOfUnits,
              "QtyInLit": product.QtyInlit,
              "DealerPrice": product.DealerPrice,
              "ListPrice": product.ListPrice,
              "IsProductScheme": product.IsSchemeAvailable,
              "ProductGroupDisplayName": product.ProductGroupDisplayName,
              "DisplayName": product.DisplayName,
              "EffectiveCasePrice": product.EffectivePricePerCase,
              "Price": product.Price,
              "UnitPrice": null,
              "ProductGroupID": product.ProductGroupID,
              "VolumeDiscountAmount":  0.0,
              "SKUDiscount": product.SKUDiscount,
              "TotalAmount": product.DealerPrice,
              "Quantity": product.quantity,
              "ProductName": product.ProductName
          };


   let alreadyExistProduct =  this.orderItems.filter(item => item.ProductID == product.ProductID);
   if(alreadyExistProduct.length > 0){

    this.products.forEach(element => {
      if(element.ProductID == product.ProductID){
        element.quantity = product.quantity;
      }        
    });

        this.orderItems.forEach(element => {
            if(element.ProductID == product.ProductID){
              element.Quantity = product.quantity;
            }        
          });
      }
      else {
        this.orderItems.push(orderItems);
      }

      this.getCalculateNetPayableDetails();

      }

    removeFromCart(product,productQuantity){
        console.log(product)
        if(productQuantity > 0){
         product.quantity = Number(productQuantity) - 1;

        let  orderItems =
              {
                  "ProductID": product.ProductID,
                  "ProductSize": product.ProductSize,
                  "ProductType": product.ProductType,
                  "Colour": product.Colour,
                  "ColorCode": product.ColorCode,
                  "ProductImageURL": product.ProductImageURL,
                  "NoOfUnits": product.NoOfUnits,
                  "QtyInLit": product.QtyInlit,
                  "DealerPrice": product.DealerPrice,
                  "ListPrice": product.ListPrice,
                  "IsProductScheme": product.IsSchemeAvailable,
                  "ProductGroupDisplayName": product.ProductGroupDisplayName,
                  "DisplayName": product.DisplayName,
                  "EffectiveCasePrice": product.EffectivePricePerCase,
                  "Price": product.Price,
                  "UnitPrice": null,
                  "ProductGroupID": product.ProductGroupID,
                  "VolumeDiscountAmount":  0.0,
                  "SKUDiscount": product.SKUDiscount,
                  "TotalAmount": product.DealerPrice,
                  "Quantity": product.quantity,
                  "ProductName": product.ProductName
              };


      let alreadyExistProduct =  this.orderItems.filter(item => item.ProductID == product.ProductID);
      if(alreadyExistProduct.length > 0){

        this.products.forEach(element => {
          if(element.ProductID == product.ProductID){
            element.quantity = product.quantity;
          }        
        });

        if(product.quantity == 0){
          const index = this.orderItems.findIndex(item => item.ProductID == product.ProductID);
          this.orderItems.splice(index, 1);
        }
        else{
        this.orderItems.forEach(element => {
            if(element.ProductID == product.ProductID){
              element.Quantity = product.quantity;
            }        
          });
        }
      }
      else {
        this.orderItems.push(orderItems);
      }

      this.getCalculateNetPayableDetails();
   }
    }

    removeProductFromCart(product){
      console.log(product)
    let alreadyExistProduct =  this.orderItems.filter(item => item.ProductID == product.ProductID);
    if(alreadyExistProduct.length > 0){

      this.products.forEach(element => {
        if(element.ProductID == product.ProductID){
          element.quantity = 0;
        }        
      });

        const index = this.orderItems.findIndex(item => item.ProductID == product.ProductID);
        this.orderItems.splice(index, 1);
    }

    this.getCalculateNetPayableDetails();
   }

  getCalculateNetPayableDetails(){
    this.loader = true;
    // call api code here...
    
    let requestObj = {
      "ProductUseTypeID": null,
      "ProductCategoryTypeID": null,
      "OrderPaymentTypeID": 0,
      "PaymentTypeInstalmentID": 0,
      "ProductGroupID": null,
      "FlashSaleID": 0,
      "ProductID": null,
      "UseWalletPoints": true,
      "IsFavouriteProduct": false,
      "dealer": {
          "DealerID": this.dealerId,
          "Name": "",
          "IsAddOn": false,
          "DeviceID": "",
          "EMail": "",
          "LanguageID": "",
          "DealerTypeID": "",
          "PhoneNo": this.phone
      },
      "orderItems": this.orderItems
    };

    this.restService.HttpPostParams = requestObj;
    this.restService.ApiEndPointUrlOrKey = Dealer.getCalculateNetPayableDetails;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;          
    this.restService.callApi()
      .subscribe(
      (sucessResponse => {     
        this.loader = false;
        //console.log(sucessResponse)
        if(sucessResponse.rs == 0){
          this.calculateNetPayableDetails = sucessResponse.data.PaymentModesCalculation;

          if(this.paymentType == ""){
            this.selectedCalculateNetPayableDetails = sucessResponse.data.PaymentModesCalculation[0];
            this.paymentType = sucessResponse.data.PaymentModesCalculation[0].OrderPaymentTypeID;
          }
          else{
            this.calculateNetPayableDetails.forEach(element => {
              if(element.OrderPaymentTypeID == this.paymentType){
                this.selectedCalculateNetPayableDetails = element;
              }              
            });
          }
          

          console.log(this.calculateNetPayableDetails);
        }
        else{
          this.calculateNetPayableDetails = [];
          this.selectedCalculateNetPayableDetails = [];          
        }
      }),
      (err => {
        this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
        this.calculateNetPayableDetails = [];
        this.selectedCalculateNetPayableDetails = [];
        this.loader = false;
      })
      );
  }

  paymentTypeChange($event){
    //console.log($event)
    this.calculateNetPayableDetails.forEach(element => {
      if(element.OrderPaymentTypeID == $event.value){
        this.selectedCalculateNetPayableDetails = element;
      }              
    });
  }

  sendForApproval(){
    this.loader = true;
    // call api code here...
    
    let requestObj = {
      "OrderID": 0,
      "DSRID": 0,
      "EMITypeID": 0,
      "NoOfEMI": 0,
      "MarketingRepID": Number(localStorage.getItem('currentUser')),
      "FlashSaleID": 0,
      "UseWalletPoints": false,
      "AddrID": 137,
      "InstalmentStartDate2": "0",
      "InstalmentStartDate1": "0",
      "PaymentTypeInstalmentID": 0,
      "AgentID": 0,
      "DefaultDistributorID": 0,
      "HappySamuraiProductGiftID": null,
      "AmazonCouponRequestID": null,
      "AmazonCouponProductGroupID": null,
      "DDProductPurchasePointToBeRedeemed": 0.0,
      "SWSContribution": 0,
      "OrderCancelled": false,
      "IsFreeOrder": null,
      "MachineID": "Weborder",
      "IntentToOrderDate": null,
      "OrderPaymentTypeID": this.paymentType,
      "dealer": {
          "DealerID": this.dealerId,
          "Name": "",
          "IsAddOn": false,
          "DeviceID": "",
          "EMail": null,
          "LanguageID": "",
          "DealerTypeID": "",
          "PhoneNo": this.phone
      },
      "orderItems": this.orderItems
  };

    this.restService.HttpPostParams = requestObj;
    this.restService.ApiEndPointUrlOrKey = Dealer.SaveDealerOrderForPlatinumUsers;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;          
    this.restService.callApi()
      .subscribe(
      (sucessResponse => {     
        this.loader = false;
        //console.log(sucessResponse)
        if(sucessResponse.rs == 0){
          this.toastr.success("Order has been successfully created with order number :- " + sucessResponse.data.Order[0].OrderID + "!!");          
        }
      }),
      (err => {
        this.toastr.error("Some Problem Occured Kindly Try Again Later!!");        
        this.loader = false;
      })
      );
  }

}
