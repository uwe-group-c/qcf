/****************************************************************
 * Created By: Muhammad Asim Baig
 * This ionic page is responsible to give functionality of 
 * login to user.
 * doLogin() function call authentication service to login.
 * user have given option to navigate to forgot password where they can 
 * recover their password. 
 * **************************************************************/

import { Component } from '@angular/core';
import { Events, NavController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { ChangePasswordPage } from '../change-password/change-password';
import { Storage } from '@ionic/storage';

import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CompanyProvider } from '../../providers/company/company';
import { CompanyModel } from '../../providers/company/company';


import { UserModel } from '../../pages/profile/profile.model';
import { ProfileService } from '../profile/profile.service';

import { AppThemeColorProvider } from '../../providers/app-theme-color/app-theme-color';


@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: FormGroup;
  main_page: { component: any };
  loading: any;
  firstLogin:any;
  userModel:UserModel = new UserModel();

  company: CompanyModel = new CompanyModel();
  token: any;

  colorTheme: any;
  colorThemeHeader:any;

  constructor(
    public events: Events,
    public nav: NavController,
    public storage:Storage,
    public loadingCtrl: LoadingController,
    public authService: AuthenticationProvider,
    public companyService: CompanyProvider,
    public profileService: ProfileService,
    public appThemeColorProvider:AppThemeColorProvider
  ) {
    this.main_page = { component: TabsNavigationPage };

    this.appThemeColorProvider.getAppThemeColor().then((value)=>{
      if(value===null){
        this.colorTheme = 'app-color-theme-4';
        this.colorThemeHeader = 'ion-header-4';
      }else if(value==='app-color-theme-1'){
        this.colorTheme = 'app-color-theme-1';
        this.colorThemeHeader = 'ion-header-1';
      }else if(value==='app-color-theme-2'){
        this.colorTheme = 'app-color-theme-2';
        this.colorThemeHeader = 'ion-header-2';
      }else if(value==='app-color-theme-3'){
        this.colorTheme = 'app-color-theme-3';
        this.colorThemeHeader = 'ion-header-3';
      }else if(value==='app-color-theme-4'){
        this.colorTheme = 'app-color-theme-4';
        this.colorThemeHeader = 'ion-header-4';
      }
    });

    this.login = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ]))
    });
  }
  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
    ]
  };
  ionViewDidLoad() {

  }

  ionViewWillLoad() {
      this.showLoader();

     //Check if already authenticated
     this.authService.checkAuthentication().then((res) => {
         console.log("Already authorized");
         this.loading.dismiss();
         this.nav.setRoot(this.main_page.component);
     }, (err) => {
         console.log("Not authorized");
         this.loading.dismiss();
     });  
  }

  showLoader(){

    this.loading = this.loadingCtrl.create({
        content: 'Authenticating...'
    });

    this.loading.present();

  }
  doLogin() {

      this.showLoader();

        let credentials = {
            email: this.login.get('email').value,
            password: this.login.get('password').value
        };
          
         this.authService.login(credentials).then(result => {
            this.loading.dismiss();
            
            this.token = result['token'];
           
            this.userModel.setUser(result['user']);

            this.storage.set('token', this.token);
            this.profileService.setData(this.userModel);  
            this.profileService.setUserImage(this.userModel.imagepath);
            
            this.companyService.getCompanyInfo(this.userModel.companyid,this.token).then(data => {
              this.company = data['company'];
              this.companyService.setCompany(this.company);
              this.appThemeColorProvider.setAppThemeColorLocally(this.company.colourtheme);
              let companyLogo = 'https://ionic2-qcf-auth.herokuapp.com/api/files/file/'+this.company.filename;
              this.events.publish('menuImage',companyLogo);
            });  



            if(this.userModel.isfirstlogin==="true"){
              this.nav.setRoot(ChangePasswordPage);
            }if(this.userModel.isfirstlogin==="false"){
              this.nav.setRoot(this.main_page.component);
            }
            

        }, (err: any) => {
            this.loading.dismiss();
                alert(`status: ${err.status}, ${err.statusText}`);
          });   
  }

  goToForgotPassword() {
    this.nav.push(ForgotPasswordPage);
  }

}
