/****************************************************************
 * Created By: Muhammad Asim Baig
 * This ionic page contact information of QCF.
 * Help to navigate to their website,
 * provide email and phone numbers
 * and locate this address on map.
 * **************************************************************/

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ContactModel } from './contact.model';

import { AppThemeColorProvider } from '../../providers/app-theme-color/app-theme-color';

@Component({
  selector: 'contact-card-page',
  templateUrl: 'contact-card.html'
})
/**
 * Class representing Contact Card Page
 */
export class ContactCardPage {
  contact: ContactModel = new ContactModel();
  colorTheme: any;
  colorThemeHeader:any;

  /**
   * Initialize class object and injecting imported dependencies and services
   * @param navCtrl 
   * @param emailComposer 
   * @param inAppBrowser 
   * @param appThemeColorProvider 
   */
  constructor(
    public navCtrl: NavController,
    private emailComposer: EmailComposer,
    public inAppBrowser: InAppBrowser,
    public appThemeColorProvider:AppThemeColorProvider
  ) {

    /**
     * Initializing color-theme for app's header navbar,menu and tabs
     */
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

  }
  /**
   * Method to launch email sending app
   */
  sendMail(){
     let email = {
      to: 'as_baig@yahoo.com',
      subject: 'This app is the best!',
      body: "Hello, I'm trying this fantastic app that will save me hours of development"
    };
    this.emailComposer.open(email);
  }
  /**
   * Method to launch web browser to launch QCF website 
   */
  openInAppBrowser(website: string){
    this.inAppBrowser.create(website, '_blank', "location=yes");
  }

}
