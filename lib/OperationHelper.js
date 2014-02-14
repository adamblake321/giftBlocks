var RSH = require('./RequestSignatureHelper').RequestSignatureHelper,
    http = require('http'),
    parser = require('xml2json');

var OperationHelper = function(params) {
  this.init(params);
};

OperationHelper.version = '2011-08-01';
OperationHelper.service = 'AWSECommerceService';
OperationHelper.defaultEndPoint = 'ecs.amazonaws.com';
OperationHelper.defaultBaseUri = '/onca/xml';

OperationHelper.prototype.init = function(params) {
  params = params || {};

  // check requried params
  if (typeof(params.awsId) === 'undefined') { throw 'Missing AWS Id param' }
  if (typeof(params.awsSecret) === 'undefined') { throw 'Missing AWS Secret param' }
  if (typeof(params.assocId) === 'undefined') { throw 'Missing Associate Id param' }

  // set instance variables from params
  this.awsId = params.awsId;
  this.awsSecret = params.awsSecret;
  this.assocId = params.assocId;
  this.endPoint = params.endPoint || OperationHelper.defaultEndPoint;
  this.baseUri = params.baseUri || OperationHelper.defaultBaseUri;
};

OperationHelper.prototype.getSignatureHelper = function() {
  if (typeof(this.signatureHelper) === 'undefined') {
    var params = {};
    params[RSH.kAWSAccessKeyId] = this.awsId;
    params[RSH.kAWSSecretKey] = this.awsSecret;
    params[RSH.kEndPoint] = this.endPoint;
    this.signatureHelper = new RSH(params);
  }
  return this.signatureHelper;
};

OperationHelper.prototype.generateParams = function(operation, params) {
  params.Service = OperationHelper.service;
  params.Version = OperationHelper.version;
  params.Operation = operation;
  params.AWSAccessKeyId = this.awsId;
  params.AssociateTag = this.assocId;
  return params;
};

OperationHelper.prototype.generateUri = function(operation, params) {
  params = this.generateParams(operation, params);
  var helper = this.getSignatureHelper();
  params = helper.sign(params);
  var queryString = helper.canonicalize(params);
  var uri = this.baseUri + '?' + queryString;
  return uri;
};

OperationHelper.prototype.execute = function(operation, params, callback) {
  if (typeof(operation) === 'undefined') { throw 'Missing operation parameter' }
  if (typeof(params) === 'undefined') { params = {} }
  var uri = this.generateUri(operation, params);
  var host = this.endPoint;
  var request = http.request({host: host, path: uri},function(response) {
    var responseBody = '';
    response.addListener('data', function(chunk) {
      responseBody += chunk;
    });
    response.addListener('end', function() {
      var statusCode = response.statusCode == 200 ? null : response.statusCode;
      callback(statusCode, parser.toJson(responseBody));
    });
    response.setEncoding('utf8');
  });
  request.end();
};

exports.OperationHelper = OperationHelper;
