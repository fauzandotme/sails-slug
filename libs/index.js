'use strict';

var _requireAll = require('require-all');

var _requireAll2 = _interopRequireDefault(_requireAll);

var _slug = require('slug');

var _slug2 = _interopRequireDefault(_slug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _nodeUuid = require('node-uuid');

var uuid = _interopRequireWildcard(_nodeUuid);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SlugsHook(sails) {

  function transformModels(models) {
    return _lodash2.default.chain(models).mapValues(function (model, key) {
      return _lodash2.default.defaults(model, {
        globalId: key,
        identity: key.toLowerCase()
      });
    }).mapKeys(function (model, key) {
      return key.toLowerCase();
    }).value();
  }

  function loadModels() {
    console.log('Loading Models...');
    try {
      var models = (0, _requireAll2.default)({
        dirname: __dirname + '/models',
        filter: /(.+)\.js$/
      });

      _lodash2.default.merge(sails.models || {}, transformModels(models));
    } catch (e) {
      console.log('No Models found');
    }
  }

  function patchModels() {
    var lowercase = true;
    _lodash2.default.forOwn(sails.models, function (model, modelName) {

      _lodash2.default.forOwn(model.attributes, function (attr, name) {
        if (attr.type === 'slug' && attr.from) {
          attr.type = 'string';
          model.beforeCreate = (function (previousBeforeCreate, attrs) {
            return function (values, cb) {
              var tableName = model.tableName;
              eval(values.asluggable);
              var from = (attrs.from) ? attrs.from : 'title',
              multifield = (attrs.multiField) ? attrs.multiField : false,
              defaultField = (attrs.defaultField) ? attrs.defaultField : null,
              defaultValue = (attrs.defaultValue) ? attrs.defaultValue : 'slug',
              remove = (attrs.remove) ? attrs.remove : null,
              lower = (attrs.lower) ? attrs.lower : true,
              separator = (attrs.separator) ? attrs.separator : "-";

              var slugName = "";
              if (multifield) {
                var fromFiled = from.split(",");
                for (var i = 0; i < fromFiled.length; i++) {
                  if (values[fromFiled[i]]) {
                    var slugbal =  values[fromFiled[i]];
                    if (i == 0 ) {slugName += (slugbal) ? slugbal : '';}
                    else {slugName += (slugbal) ? ' ' + slugbal : '';}
                  }
                }
              }
              else {
                slugName = values[from];
              }
              slugName = (slugName) ? slugName : values[defaultField];
              slugName = (slugName) ? slugName : defaultValue;
              slugName = (slugName) ?  (0, _slug2.default)(slugName, {lower: lower, replacement: separator, remove: remove}): 'slug';
              var criteria = {};
              criteria[name] = { 'like': slugName+'%' };
              criteria['select'] = [name];

              // Check that slug is not already used
              sails.models[modelName].find(criteria).then(function (found) {
                if (found && found.length > 0) {
                  var slugNo = 1;
                  var suffix = false;
                  for (var i = 0; i < found.length; i++) {
                    var str = found[i][name];
                    var regx = "^"+slugName+"-[0-9]*$";
                    var patt = new RegExp(regx);
                    if(patt.test(str)) {
                      var res = str.replace(slugName+"-", "");
                      if (!isNaN(res)) {
                        var num = parseInt(res);
                        if (num >= slugNo) {
                          suffix = true;
                          slugNo = num + 1;
                          console.log(slugNo);
                          values[name] = slugName +separator+ slugNo;
                        }

                      }
                    }
                    else {
                      if (!suffix) {
                        suffix = true;
                        values[name] = slugName;
                        if (str == slugName) {
                          suffix = true;
                          values[name] = slugName +separator+ slugNo;
                        }
                      }
                    }

                  }

                  if (!suffix) {
                    values[name] = slugName +separator+ uuid.v4();
                  }


                } else {
                  values[name] = slugName;
                }

                if (typeof previousBeforeCreate === 'function') {
                  previousBeforeCreate(values, cb);
                } else {
                  cb();
                }
              }).catch(cb);
            };
          })(model.beforeCreate, attr);
          model.beforeUpdate = (function (previousBeforeCreate, attrs) {
            return function (values, cb) {
              var tableName = model.tableName;
              eval(values.asluggable);
              var from = (attrs.from) ? attrs.from : 'title',
              multifield = (attrs.multiField) ? attrs.multiField : false,
              defaultField = (attrs.defaultField) ? attrs.defaultField : null,
              defaultValue = (attrs.defaultValue) ? attrs.defaultValue : 'slug',
              remove = (attrs.remove) ? attrs.remove : null,
              lower = (attrs.lower) ? attrs.lower : true,
              separator = (attrs.separator) ? attrs.separator : "-";

              var slugName = "";
              if (multifield) {
                var fromFiled = from.split(",");
                for (var i = 0; i < fromFiled.length; i++) {
                  if (values[fromFiled[i]]) {
                    var slugbal =  values[fromFiled[i]];
                    if (i == 0 ) {slugName += (slugbal) ? slugbal : '';}
                    else {slugName += (slugbal) ? ' ' + slugbal : '';}
                  }
                }
              }
              else {
                slugName = values[from];
              }
              slugName = (slugName) ? slugName : values[defaultField];
              slugName = (slugName) ? slugName : defaultValue;
              slugName = (slugName) ?  (0, _slug2.default)(slugName, {lower: lower, replacement: separator, remove: remove}): 'slug';
              var criteria = {};
              criteria[name] = { 'like': slugName+'%' };
              criteria['select'] = [name];

              // Check that slug is not already used
              sails.models[modelName].find(criteria).then(function (found) {
                if (found && found.length > 0) {
                  var slugNo = 1;
                  var suffix = false;
                  for (var i = 0; i < found.length; i++) {
                    var str = found[i][name];
                    var regx = "^"+slugName+"-[0-9]*$";
                    var patt = new RegExp(regx);
                    if(patt.test(str)) {
                      var res = str.replace(slugName+"-", "");
                      if (!isNaN(res)) {
                        var num = parseInt(res);
                        if (num >= slugNo) {
                          suffix = true;
                          slugNo = num + 1;
                          console.log(slugNo);
                          values[name] = slugName +separator+ slugNo;
                        }

                      }
                    }
                    else {
                      if (!suffix) {
                        suffix = true;
                        values[name] = slugName;
                        if (str == slugName) {
                          suffix = true;
                          values[name] = slugName +separator+ slugNo;
                        }
                      }
                    }

                  }

                  if (!suffix) {
                    values[name] = slugName +separator+ uuid.v4();
                  }


                } else {
                  values[name] = slugName;
                }

                if (typeof previousBeforeCreate === 'function') {
                  previousBeforeCreate(values, cb);
                } else {
                  cb();
                }
              }).catch(cb);
            };
          })(model.beforeUpdate, attr);

          /*delete attr.from;
          delete attr.defaultField;
          delete attr.defaultValue;
          delete attr.multiField;
          delete attr.remove;
          delete attr.separator;
          delete attr.lower;*/
        }
      });
    });
  }

  return {

    defaults: {
      __configKey__: {
        lowercase: true
      }
    },

    initialize: function initialize(next) {

      //loadModels();

      sails.after(['hook:moduleloader:loaded'], function () {

        patchModels();

        return next();
      });
    }
  };
}

module.exports = SlugsHook;
