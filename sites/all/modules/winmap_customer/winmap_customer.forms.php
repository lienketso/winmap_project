<?php

function winmap_customer_form($form, &$form_state, $customer = NULL){
  $form = array();
  $form['#customer'] = $form_state['#customer'] = $customer;
  $form['name'] = [
    '#type' => 'textfield',
    '#title' => t('Name'),
    '#default_value' => !empty($customer->name)?$customer->name:'',
    '#size' => 60,
    '#maxlength' => 128,
    '#required' => TRUE,
  ];
  $form['domain'] = [
    '#type' => 'textfield',
    '#title' => t('Domain name'),
    '#default_value' => !empty($customer->domain)?$customer->domain:'',
    '#size' => 60,
    '#maxlength' => 128,
    '#required' => TRUE,
  ];
  $form['email'] = [
    '#type' => 'textfield',
    '#title' => t('Email address'),
    '#default_value' => !empty($customer->email)?$customer->email:'',
    '#size' => 60,
    '#maxlength' => 128,
    '#required' => TRUE,
  ];
  $form['phone'] = [
    '#type' => 'textfield',
    '#title' => t('Phone number'),
    '#default_value' => !empty($customer->phone)?$customer->phone:'',
    '#size' => 60,
    '#maxlength' => 128,
    '#required' => TRUE,
  ];
  $form['username'] = [
    '#type' => 'textfield',
    '#title' => t('User name'),
    '#default_value' => !empty($customer->username)?$customer->username:'',
    '#size' => 60,
    '#maxlength' => 128,
    '#required' => TRUE,
  ];
  $form['password'] = [
    '#type' => 'password',
    '#title' => t('Password'),
    '#default_value' => !empty($customer->password)?$customer->password:'',
    '#size' => 60,
    '#maxlength' => 128,
    '#required' => TRUE,
  ];
  $form['status'] = array(
    '#type' => 'select',
    '#title' => t('Status'),
    '#options' => array(
      0 => t('No'),
      1 => t('Yes'),
    ),
    '#default_value' => !empty($customer->status)?$customer->status:'0',
    '#description' => t('Set this to <em>Yes</em> if you would like this category to be selected by default.'));

  $form['submit'] = array('#type' => 'submit', '#value' => t('Save'));

  return $form;
}

function winmap_customer_form_validate($form, $form_state) {
//  form_set_error('name', t('Weight value must be numeric.'));
  $customer = $form_state['#customer'];
  if (!empty($customer->id)) {
    $last_changed = winmap_customer_last_changed($customer->id);
    if ($last_changed != $customer->changed) {
      form_set_error('', 'Có người dùng khác đang cập nhật, vui lòng thử lại sau');
    }

  }
//  if (!customer_validate_unique_domain($domain)) {
//    form_set_error('domain',t('The domain %domain already exists.'));
//  }

}


function winmap_customer_form_submit($form, &$form_state) {
  try {
    $customer = $form_state['#customer']??new stdClass();
    $customer->name = $form_state['values']['name'];
    $customer->domain = $form_state['values']['domain'];
    $customer->email = $form_state['values']['email'];
    $customer->phone = $form_state['values']['phone'];
    $customer->username = $form_state['values']['username'];
    $customer->password = $form_state['values']['password'];
    $customer->status = $form_state['values']['status'];
    $customer = save($customer);
    if (!empty($customer)) {
      drupal_set_message(t('Customer '.$customer->name.' has bean created.'));
      drupal_goto('admin/enterprises');
    }else {
      drupal_set_message(t('System is busy.'));
    }
  } catch (Exception $e) {
    // Handle error.
    drupal_set_message(t('An error occurred: @message', array('@message' => $e->getMessage())), 'error');
  }
}
