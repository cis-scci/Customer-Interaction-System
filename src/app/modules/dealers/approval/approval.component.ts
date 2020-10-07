import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import {Component, OnInit, ViewChild,TemplateRef} from '@angular/core';
import { HandelError , Dealer } from '../../../shared/enumrations/app-enum.enumerations';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { GlobalRestService } from '../../../services/rest/global-rest.service';
import { ToastrService } from 'ngx-toastr';
import { SearchPipe } from '../../../shared/filter-pipe/filter-pipe';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'; 

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit {

  loader: boolean = false;
  cartProductDetailLoader: boolean = false;
  productDetailLoader: boolean = false;
  phone: string = "";
  paymentType : string = "";
  dealerName : string = "";
  dealerId : string;
  deviceId : string;
  categories : any = [];
  products : any = [];
  orderItems : any = [];
  calculateNetPayableDetails : any = [];
  selectedCalculateNetPayableDetails : any = [];
  query : string = "";
  modalRef: BsModalRef;    

  constructor(private modalService: BsModalService,private toastr: ToastrService,private restService: GlobalRestService,private primaryHeader: PrimaryHeaderService,private route: ActivatedRoute,private router:Router) { }

  ngOnInit() {
        //setting page title
        this.primaryHeader.pageTitle.next("Dealer Cart");
        this.primaryHeader.dealerName.subscribe(value => this.dealerName = value);
        this.route.params.subscribe((params: Params) => {
          this.dealerId = params['id'];
          this.deviceId = params['deviceId'];
          this.phone =  params['phone'];
          this.getProducts();
        }, error => {
          console.error('Error: ', error);
        });
  }

  getProducts(){
    this.productDetailLoader = true;
    // call api code here...

    let requestObj = {
      "dealer":
      {
      "DealerID": this.dealerId,
          "PhoneNo": this.phone,
          "DeviceID": this.deviceId,
          "IsAddOn": false
      },
      "ProductUseTypeID":0,
      "ProductCategoryTypeID":0

  }

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
              "ProductName": product.ProductName,
              "AmountAfterDiscount": 0.0,
              "FlashSaleID": 0,
              "GSPoints": 0.0,
              "GSPointsPerCase": 0.0,
              "PendingGroupQuantity": 0,
              "PendingOrderQty": 0,
              "PlatinumDiscountApplicable": 0.0,
              "QuantityInLitersPerUnit": "",
              "SKUDiscountApplicable": 0.0,
              "SKUPointValue": 0,
              "SKUPoints": 0.0,
              "SavingAmount": 0.0,
              "SavingPerCaseAmount": 0.0,
              "TotalSchemeSaving": 0.0,
              "YouSave": 0.0
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
    this.cartProductDetailLoader = true;
    // call api code here...

    let requestObj = {
      "FlashSaleID": 0,
      "OrderPaymentTypeID": 0,
      "PaymentTypeInstalmentID": 0,
      "dealer": {
          "DealerID": this.dealerId,
          "DealerTypeID": "",
          "DeviceID": this.deviceId,
          "EMail": "",
          "IsAddOn": false,
          "Name": "",
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
        this.cartProductDetailLoader = false;
        //console.log(sucessResponse)
        if(sucessResponse.rs == 0){
          this.calculateNetPayableDetails = sucessResponse.data;

          if(this.paymentType == ""){
            this.selectedCalculateNetPayableDetails = sucessResponse.data[0];
            this.paymentType = sucessResponse.data[0].OrderPaymentTypeID;
          }
          else{
            this.calculateNetPayableDetails.forEach(element => {
              if(element.OrderPaymentTypeID == this.paymentType){
                this.selectedCalculateNetPayableDetails = element;
              }
            });
          }

        if(this.selectedCalculateNetPayableDetails.Value.NetPayable[0].AmountAfterGST == null){
          this.calculateNetPayableDetails = [];
          this.selectedCalculateNetPayableDetails = [];
          this.orderItems = [];
          this.products.forEach(element => {
            element["quantity"] = 0;
          });
        }
          console.log(this.calculateNetPayableDetails);
        }
        else{
          this.calculateNetPayableDetails = [];
          this.selectedCalculateNetPayableDetails = [];
          this.orderItems = [];
          this.products.forEach(element => {
            element["quantity"] = 0;
          });
          this.toastr.warning("Some error occured on adding this product!!");
        }
      }),
      (err => {
        this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
        this.calculateNetPayableDetails = [];
        this.selectedCalculateNetPayableDetails = [];
        this.orderItems = [];
        this.products.forEach(element => {
          element["quantity"] = 0;
        });
        this.cartProductDetailLoader = false;
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

    let requestObj =
        {
          "dealer": {
            "DealerID": this.dealerId,
              "PhoneNo": this.phone,
              "DeviceID": this.deviceId,
            "IsAddOn": false
          },
          "OrderID": 0,
          "orderItems": this.orderItems,
          "OrderPaymentTypeID": this.paymentType,
          "MarketingRepID": Number(localStorage.getItem('currentUser')),
          "DSRID": 0,
          "AgentID": 0,
          "DefaultDistributorID": 0,
          "MachineID": "WebOrder",
          "SWSContribution":0.0,
          "IsFreeOrder":false,
          "HappySamuraiProductGiftID":0 ,
          "FlashSaleID":null
      }


    this.restService.HttpPostParams = requestObj;
    this.restService.ApiEndPointUrlOrKey = Dealer.SaveDealerOrderForPlatinumUsers;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.callApi()
      .subscribe(
      (sucessResponse => {
        this.loader = false;
        //console.log(sucessResponse)
        if(sucessResponse.rs == 0){
          let orderId = sucessResponse.data.Order[0].OrderID;          
          this.toastr.success("Order has been successfully created and sent for approval with order number :- " + orderId + "!!");
          this.calculateNetPayableDetails = [];
          this.selectedCalculateNetPayableDetails = [];
          this.orderItems = [];
          this.products.forEach(element => {
            element["quantity"] = 0;
          });

          let keyData = [
            {
              "name": "OrderID",
              "value": orderId
            }
          ];

          this.restService.ApiEndPointUrlOrKey = Dealer.approveOrder;
          this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
          this.restService.callApi(keyData)
            .subscribe(
            (sucessResponse => {
              this.loader = false;
              //console.log(sucessResponse)
              if(sucessResponse.rs == 0){
                // this.toastr.success("Order has been successfully created and sent for approval with order number :- " + orderId + "!!");
              }
              else if(sucessResponse.rs == 1){
                this.calculateNetPayableDetails = [];
                this.selectedCalculateNetPayableDetails = [];
                this.orderItems = [];
                this.products.forEach(element => {
                  element["quantity"] = 0;
                });
              }
            }),
            (err => {
              this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
              this.loader = false;
              this.calculateNetPayableDetails = [];
              this.selectedCalculateNetPayableDetails = [];
              this.orderItems = [];
              this.products.forEach(element => {
                element["quantity"] = 0;
              });
            })
            );

        }
        else if(sucessResponse.rs == 1){
          this.calculateNetPayableDetails = [];
          this.selectedCalculateNetPayableDetails = [];
          this.orderItems = [];
          this.products.forEach(element => {
            element["quantity"] = 0;
          });
        }
      }),
      (err => {
        this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
        this.loader = false;
        this.calculateNetPayableDetails = [];
        this.selectedCalculateNetPayableDetails = [];
        this.orderItems = [];
        this.products.forEach(element => {
          element["quantity"] = 0;
        });
      })
      );
  }

  cancelOrder(){
    this.calculateNetPayableDetails = [];
    this.selectedCalculateNetPayableDetails = [];
    this.orderItems = [];
    this.products.forEach(element => {
      element["quantity"] = 0;
    });
  }

  backToList(){
    this.router.navigate(["/dealers"]);
  }

}