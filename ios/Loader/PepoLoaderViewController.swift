/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 */

import UIKit
import OstWalletSdk

@objc public class PepoLoaderViewController: UIViewController, OstWorkflowLoader {
  
  //MARK: - Progress Components
  let heartImageView: UIImageView  = {
    let imageView = UIImageView(frame: .zero)
    imageView.image =  UIImage(named: "PepoWhiteIcon")
    imageView.contentMode = .scaleAspectFit
    imageView.translatesAutoresizingMaskIntoConstraints = false
    return imageView
  }()
  
  let messageLabel: UILabel = {
    let label = UILabel(frame: .zero)
    label.textColor = .white
    label.text = "Processing..."
    label.font = UIFont(name: "AvenirNext-DemiBold", size: 18)
    label.numberOfLines = 0
    label.textAlignment = .center
    label.translatesAutoresizingMaskIntoConstraints = false
    
    return label
  }()
  
  let progressContainerView: UIView = {
    let view = UIView(frame: .zero)
    view.backgroundColor = .clear
    view.clipsToBounds = true
    view.translatesAutoresizingMaskIntoConstraints = false
    
    return view
  }()
  
  let progressBarBackgroundView: UIView = {
    let view = UIView(frame: .zero)
    view.backgroundColor = .white
    view.layer.cornerRadius = 3
    view.clipsToBounds = true
    view.translatesAutoresizingMaskIntoConstraints = false
    
    return view
  }()
  
  let progressBarView: UIView = {
    let view = UIView(frame: .zero)
    view.backgroundColor = UIColor(red: (255/255),green: (116/255), blue: (153/255), alpha: 1)
    view.clipsToBounds = true
    view.layer.cornerRadius = 3
    view.translatesAutoresizingMaskIntoConstraints = false
    
    return view
  }()
  
  //MARK: - Alert Components
  let alertContainerView: UIView = {
    let view = UIView(frame: .zero)
    view.backgroundColor = .clear
    view.clipsToBounds = true
    view.isHidden = true
    view.translatesAutoresizingMaskIntoConstraints = false
    
    return view
  }()
  
  let alertIcon: UIImageView  = {
    let imageView = UIImageView(frame: .zero)
    imageView.image = UIImage(named: "")
    imageView.contentMode = .scaleAspectFit
    imageView.translatesAutoresizingMaskIntoConstraints = false
    return imageView
  }()
  
  let alertMessageLabel: UILabel = {
    let label = UILabel(frame: .zero)
    label.textColor = .white
    label.text = ""
    label.font = UIFont(name: "AvenirNext-DemiBold", size: 18)
    label.numberOfLines = 0
    label.textAlignment = .center
    label.translatesAutoresizingMaskIntoConstraints = false
    
    return label
  }()
  
  let dismissButton: UIButton = {
    let button = UIButton()
    
    button.backgroundColor = UIColor(red: (255/255),green: (116/255), blue: (153/255), alpha: 1)
    button.layer.cornerRadius = 5
    button.setTitleColor(.white, for: .normal)
    button.clipsToBounds = true
    button.contentEdgeInsets = UIEdgeInsets(top: 5, left: 14, bottom: 5, right: 14)
    button.translatesAutoresizingMaskIntoConstraints = false
    
    return button
  }()
  
  //MARK: - Variables
  var leftAnchor: NSLayoutConstraint? = nil
  var ostLoaderComplectionDelegate: OstLoaderCompletionDelegate? = nil
  var isAlertView: Bool = false
  var isApiSignerUnauthorized: Bool = false
  var workflowContext: OstWorkflowContext? = nil
  var error: OstError? = nil
  var contextEntity: OstContextEntity? = nil
  
  //MARK: - View Life Cycle
  deinit {
    print("\(String(describing: self)) :: deinit")
  }
  
  override public func viewDidLoad() {
    super.viewDidLoad()
    UIView.animate(withDuration: 0.3) {[weak self] in
      self?.view.backgroundColor = UIColor.black.withAlphaComponent(0.3)
    }
    
    config()
    addSubviews()
    addLayoutConstraints()
  }
  
  override public func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    
    self.view.backgroundColor = UIColor.black.withAlphaComponent(0.7)
    UIView.transition(with: self.view, duration: 0.3, options: .transitionCrossDissolve, animations: {[weak self] in
      self?.view.isHidden = false
    }, completion: {[weak self] (_) in
        self?.animateLoader()
    })
  }
  
  func config() {
    
    self.view.isHidden = true
    
    dismissButton.addTarget(self, action: #selector(dismissButtonTapped(_:)), for: .touchUpInside)
    
    let tap = UITapGestureRecognizer(target: self, action: #selector(viewTapped))
    tap.numberOfTapsRequired = 1
    self.view.addGestureRecognizer(tap)
  }
  
  func addSubviews() {
    self.view.addSubview(progressContainerView)
    self.view.addSubview(alertContainerView)
    
    //Progress view
    progressContainerView.addSubview(heartImageView)
    progressContainerView.addSubview(messageLabel)
    progressContainerView.addSubview(progressBarBackgroundView)
    progressBarBackgroundView.addSubview(progressBarView)
    
    //Alert view
    alertContainerView.addSubview(alertIcon)
    alertContainerView.addSubview(alertMessageLabel)
    alertContainerView.addSubview(dismissButton)
  }
  
  //MARK: - Actions
  @objc
  func dismissButtonTapped(_ sender: Any) {
    if isApiSignerUnauthorized {
      let params:[AnyHashable: Any] = ["callbackType": "logout"]
      
      let instance: PepoEventEmitter = PepoEventEmitter.sharedInstance() as! PepoEventEmitter
      instance.sendEvent(withParams: params, forWorkflowId: "logout")
    }
    closeLoader()
  }
  
  @objc
  func closeLoader() {
    NSObject.cancelPreviousPerformRequests(withTarget: self, selector: #selector(closeLoader), object: nil)
    
    UIView.transition(with: self.view, duration: 0.3, options: .transitionCrossDissolve, animations: {[weak self] in
      self?.view.isHidden = true
    }) { (_) in
        self.ostLoaderComplectionDelegate?.dismissWorkflow()
    }
  }
  
  @objc
  func viewTapped() {
    if isAlertView && !isApiSignerUnauthorized {
      closeLoader()
    }
  }
  
  //MARK: - Add Layout
  func addLayoutConstraints() {
    //Progress Container
    containerViewConstraints()
    heartImageViewConstraints()
    messageLabelConstraints()
    progressBarBackgroundViewConstraints()
    progressBarViewConstraints()
    
    let lastView = progressBarBackgroundView
    lastView.bottomAlignWithParent()
    
    //Alert Container
    alertContainerViewConstraints()
    alertIconViewConstraints()
    alertMessageLabelConstraints()
    dismissButtonConstraints()
    
    let alertLastView = dismissButton
    alertLastView.bottomAlignWithParent()
  }
  
  func containerViewConstraints() {
    progressContainerView.leftAlignWithParent()
    progressContainerView.rightAlignWithParent()
    progressContainerView.centerYAlignWithParent()
  }
  
  func heartImageViewConstraints() {
    heartImageView.topAlignWithParent(multiplier: 1, constant: 10)
    heartImageView.setW375Width(width: 40)
    heartImageView.setAspectRatio(widthByHeight: 1)
    heartImageView.centerXAlignWithParent()
  }
  
  func messageLabelConstraints() {
    messageLabel.placeBelow(toItem: heartImageView, constant: 30)
    messageLabel.applyBlockElementConstraints(horizontalMargin: 20)
  }
  
  func progressBarBackgroundViewConstraints() {
    progressBarBackgroundView.placeBelow(toItem: messageLabel, constant: 20)
    progressBarBackgroundView.setW375Width(width: 200)
    progressBarBackgroundView.setFixedHeight(multiplier: 1, constant: 6)
    progressBarBackgroundView.centerXAlignWithParent()
  }
  
  func progressBarViewConstraints() {
    leftAnchor = progressBarView.leftAnchor.constraint(equalTo: progressBarView.superview!.leftAnchor, constant: -50)
    leftAnchor?.isActive = true
    progressBarView.topAnchor.constraint(equalTo: progressBarView.superview!.topAnchor).isActive = true
    progressBarView.bottomAnchor.constraint(equalTo: progressBarView.superview!.bottomAnchor).isActive = true
    progressBarView.setW375Width(width: 50)
  }
  
  //MARK: - Alert Constraints
  func alertContainerViewConstraints() {
    alertContainerView.leftAlignWithParent()
    alertContainerView.rightAlignWithParent()
    alertContainerView.centerYAlignWithParent()
  }
  
  func alertIconViewConstraints() {
    alertIcon.topAlignWithParent(multiplier: 1, constant: 10)
    alertIcon.setW375Width(width: 45)
    alertIcon.setAspectRatio(widthByHeight: 1)
    alertIcon.centerXAlignWithParent()
  }
  
  func alertMessageLabelConstraints() {
    alertMessageLabel.placeBelow(toItem: alertIcon, constant: 16)
    alertMessageLabel.applyBlockElementConstraints(horizontalMargin: 20)
  }
  
  func dismissButtonConstraints() {
    dismissButton.topAnchor.constraint(equalTo: alertMessageLabel.bottomAnchor, constant: 20).isActive = true
    dismissButton.setW375Width(width: 200)
    dismissButton.centerXAlignWithParent()
  }
  
  //MARK: - Animate
  
  func animateLoader() {
    indefinateProgressBarAnimation()
    UIView.animate(withDuration: 0.4, animations: {[weak self] in
      self?.heartImageView.transform = CGAffineTransform(rotationAngle: CGFloat(-210))
    }) { (isCompleted) in
      UIView.animate(withDuration: 0.2, animations: {[weak self] in
        self?.heartImageView.transform = CGAffineTransform(rotationAngle: CGFloat(205))
      }) {[weak self] (isCompleted) in
        self?.heartPumpingAnimation()
      }
    }
  }
  
  func heartPumpingAnimation() {
    let animation = CABasicAnimation(keyPath: "transform.scale")
    animation.duration = 0.5
    animation.repeatCount = Float.infinity
    animation.autoreverses = true
    animation.fromValue = 1
    animation.toValue = 1.2
    animation.timingFunction = CAMediaTimingFunction(name: CAMediaTimingFunctionName.easeIn)
    heartImageView.layer.add(animation, forKey: "transform.scale")
  }
  
  func indefinateProgressBarAnimation() {
    let animation = CABasicAnimation(keyPath: "transform.translation.x")
    animation.duration = 0.8
    animation.repeatCount = Float.infinity
    animation.autoreverses = false
    animation.fromValue = -50
    animation.toValue = self.progressBarBackgroundView.frame.width + 50
    animation.timingFunction = CAMediaTimingFunction(name: CAMediaTimingFunctionName.easeIn)
    progressBarView.layer.add(animation, forKey: "transform.translation.x")
  }
  
  //MARK: - Pepo Alert
  
  func closeProgressAnimation() {
    heartImageView.layer.removeAnimation(forKey: "transform.scale")
    progressBarView.layer.removeAnimation(forKey: "transform.translation.x")
    
    isAlertView = true
    
    progressContainerView.isHidden = true
    alertContainerView.isHidden = false
  }
  
  func showSuccessAlert(workflowContext: OstWorkflowContext,
                        contextEntity: OstContextEntity?,
                        workflowConfig: [String : Any]) {
    closeProgressAnimation()
    
    alertIcon.image = UIImage(named: "SuccessIcon")
    
    var loaderString = ""
    if let ackTextHash = workflowConfig["success"] as? [String: String],
      let text = ackTextHash["text"] {
      loaderString = text
    }
    
    dismissButton.isHidden = true
    alertMessageLabel.text = loaderString
    perform(#selector(closeLoader), with: nil, afterDelay: 4)
    
    self.alertContainerView.layoutIfNeeded()
  }
  
  func showFailureAlert(workflowContext: OstWorkflowContext,
                        error: OstError) {
    closeProgressAnimation()
    
    alertIcon.image = UIImage(named: "FailureIcon")
    let errorMessage = OstSdkErrorHelper.shared.getErrorMessage(for: workflowContext, andError: error)
    alertMessageLabel.text = errorMessage
    
    if isApiSignerUnauthorized {
      dismissButton.setTitle("Logout", for: .normal)
    }else {
      dismissButton.setTitle("Close", for: .normal)
    }
    
    dismissButton.isHidden = false
    
    self.alertContainerView.layoutIfNeeded()
  }
  
  
  //MARK: - OstWorkflowLoader
  @objc public func onInitLoader(workflowConfig: [String: Any]) {
    var loaderString: String = "Initializing..."
    
    if let initLoaderData = workflowConfig["initial_loader"] as? [String: String],
      let text = initLoaderData["text"] {
      loaderString = text
    }
    messageLabel.text = loaderString
  }
  
  @objc public  func onPostAuthentication(workflowConfig: [String: Any]) {
    var loaderString: String = "Processing..."
    
    if let initLoaderData = workflowConfig["loader"] as? [String: String],
      let text = initLoaderData["text"] {
      loaderString = text
    }
    
    DispatchQueue.main.async {[weak self] in
      self?.messageLabel.text = loaderString
    }
  }
  
  @objc public  func onAcknowledge(workflowConfig: [String: Any]) {
    var loaderString = "Waiting for confirmation..."
    if let ackTextHash = workflowConfig["acknowledge"] as? [String: String],
      let text = ackTextHash["text"] {
      loaderString = text
    }
    
    DispatchQueue.main.async {[weak self] in
      self?.messageLabel.text = loaderString
    }
  }
  
  @objc public
  func onSuccess(workflowContext: OstWorkflowContext,
                               contextEntity: OstContextEntity,
                               workflowConfig: [String : Any],
                               loaderCompletionDelegate: OstLoaderCompletionDelegate) {
    
    self.workflowContext = workflowContext
    self.contextEntity = contextEntity
    
    ostLoaderComplectionDelegate = loaderCompletionDelegate
    
    showSuccessAlert(workflowContext: workflowContext,
                     contextEntity: contextEntity,
                     workflowConfig: workflowConfig)
  }
  
  @objc public
  func onFailure(workflowContext: OstWorkflowContext,
                                error: OstError,
                                workflowConfig: [String : Any],
                                loaderCompletionDelegate: OstLoaderCompletionDelegate) {
    self.workflowContext = workflowContext
    self.error = error
    setIsApiSignerUnauthorized()
    
    if isApiSignerUnauthorized {
      loaderCompletionDelegate.dismissWorkflow();
      return;
    }
    ostLoaderComplectionDelegate = loaderCompletionDelegate
    
    showFailureAlert(workflowContext: workflowContext,
                     error: error)
  }
  
  func setIsApiSignerUnauthorized() {
    if let apiError = self.error as? OstApiError {
      isApiSignerUnauthorized = apiError.isApiSignerUnauthorized()
    }
  }
}
