/*
 * 校验工具
 * @author ZnPi
 * @date 2022-09-16
 */
/**
 * office excel 后缀模式
 */
const SHEET_SUFFIX_PATTERN = /\.(xlsx|xls)$/i;
/**
 * email 模式
 */
const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * 手机号模式
 */
const PHONE_PATTERN =
  /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;

const EXTERNAL_LINK_PATTERN = /^(https?:|http?:|mailto:|tel:)/;

/**
 * 是否是 office 的 excel 类型文件
 * @param filename
 */
function isSheet(filename: string) {
  if (SHEET_SUFFIX_PATTERN.test(filename)) {
    return true;
  }
  return false;
}

/**
 * 是否不是 office 的 excel 类型文件
 * @param filename
 */
function isNotSheet(filename: string) {
  return !isSheet(filename);
}

function isPhone(phone: string) {
  if (PHONE_PATTERN.test(phone)) {
    return true;
  }
  return false;
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
function isExternalLink(path: string): boolean {
  const isExternal = EXTERNAL_LINK_PATTERN.test(path);
  return isExternal;
}

/**
 * 是否为图片
 */
function isAssetTypeAnImage(ext: string) {
  return (
    ["png", "jpg", "jpeg", "bmp", "gif", "webp", "psd", "svg", "tiff"].indexOf(
      ext.toLowerCase()
    ) !== -1
  );
}

/**
 * 是否为邮件格式
 * @param {string} email
 * @returns {Boolean} true: 是邮件格式; false: 不是邮件格式
 */
function isEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

/**
 * 验证手机号
 * @param _rule
 * @param value
 * @param callback
 */
const validatePhone = (_rule: any, value: any, callback: any) => {
  if (value && !isPhone(value)) {
    callback(new Error("手机号不合法"));
  }
  callback();
};

/**
 * 验证邮箱
 * @param _rule
 * @param value
 * @param callback
 */
const validateEmail = (_rule: any, value: any, callback: any) => {
  if (value && !isEmail(value)) {
    callback(new Error("邮箱不合法"));
  }
  callback();
};

export {
  isSheet,
  isNotSheet,
  isPhone,
  isExternalLink,
  isAssetTypeAnImage,
  isEmail,
  validatePhone,
  validateEmail,
};
