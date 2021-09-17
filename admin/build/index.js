import {
  __commonJS,
  __toModule,
  require_Button,
  require_Checkbox,
  require_Chip,
  require_FormControlLabel,
  require_Grid,
  require_IconButton,
  require_ListSubheader,
  require_Paper,
  require_Popper,
  require_TextField,
  require_Tooltip,
  require_Typography,
  require_app,
  require_clsx,
  require_createSvgIcon,
  require_de,
  require_en,
  require_es,
  require_fr,
  require_hooks,
  require_interopRequireDefault,
  require_interopRequireWildcard,
  require_it,
  require_nl,
  require_pl,
  require_prop_types,
  require_pt,
  require_react,
  require_react_dom,
  require_ru,
  require_styles,
  require_utils,
  require_zh_cn,
  useAPI
} from "./chunk-QFE6BTOS.js";

// node_modules/@material-ui/icons/Sync.js
var require_Sync = __commonJS({
  "node_modules/@material-ui/icons/Sync.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React8 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React8.createElement("path", {
      d: "M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
    }), "Sync");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/GetApp.js
var require_GetApp = __commonJS({
  "node_modules/@material-ui/icons/GetApp.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React8 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React8.createElement("path", {
      d: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
    }), "GetApp");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/LiveHelp.js
var require_LiveHelp = __commonJS({
  "node_modules/@material-ui/icons/LiveHelp.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React8 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React8.createElement("path", {
      d: "M19 2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 16h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 11.9 13 12.5 13 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
    }), "LiveHelp");
    exports.default = _default;
  }
});

// admin/src/index.tsx
var import_react3 = __toModule(require_react());
var import_react_dom = __toModule(require_react_dom());
var import_app = __toModule(require_app());
var import_hooks2 = __toModule(require_hooks());
var import_styles4 = __toModule(require_styles());
var import_Grid = __toModule(require_Grid());

// node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}

// node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js
function _objectWithoutProperties(source, excluded) {
  if (source == null)
    return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key))
        continue;
      target[key] = source[key];
    }
  }
  return target;
}

// node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

// node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

// node_modules/@material-ui/lab/esm/Autocomplete/Autocomplete.js
var React4 = __toModule(require_react());
var import_prop_types = __toModule(require_prop_types());
var import_clsx = __toModule(require_clsx());
var import_styles = __toModule(require_styles());
var import_Popper = __toModule(require_Popper());
var import_ListSubheader = __toModule(require_ListSubheader());
var import_Paper = __toModule(require_Paper());
var import_IconButton = __toModule(require_IconButton());
var import_Chip = __toModule(require_Chip());

// node_modules/@material-ui/lab/esm/internal/svg-icons/Close.js
var React = __toModule(require_react());
var import_utils = __toModule(require_utils());
var Close_default = (0, import_utils.createSvgIcon)(/* @__PURE__ */ React.createElement("path", {
  d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
}), "Close");

// node_modules/@material-ui/lab/esm/internal/svg-icons/ArrowDropDown.js
var React2 = __toModule(require_react());
var import_utils2 = __toModule(require_utils());
var ArrowDropDown_default = (0, import_utils2.createSvgIcon)(/* @__PURE__ */ React2.createElement("path", {
  d: "M7 10l5 5 5-5z"
}), "ArrowDropDown");

// node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr))
    return arr;
}

// node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}

// node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

// node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

// node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

// node_modules/@babel/runtime/helpers/esm/slicedToArray.js
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

// node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}

// node_modules/@material-ui/lab/esm/useAutocomplete/useAutocomplete.js
var React3 = __toModule(require_react());
var import_utils3 = __toModule(require_utils());
function stripDiacritics(string) {
  return typeof string.normalize !== "undefined" ? string.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : string;
}
function createFilterOptions() {
  var config = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var _config$ignoreAccents = config.ignoreAccents, ignoreAccents = _config$ignoreAccents === void 0 ? true : _config$ignoreAccents, _config$ignoreCase = config.ignoreCase, ignoreCase = _config$ignoreCase === void 0 ? true : _config$ignoreCase, limit = config.limit, _config$matchFrom = config.matchFrom, matchFrom = _config$matchFrom === void 0 ? "any" : _config$matchFrom, stringify = config.stringify, _config$trim = config.trim, trim = _config$trim === void 0 ? false : _config$trim;
  return function(options, _ref3) {
    var inputValue = _ref3.inputValue, getOptionLabel = _ref3.getOptionLabel;
    var input = trim ? inputValue.trim() : inputValue;
    if (ignoreCase) {
      input = input.toLowerCase();
    }
    if (ignoreAccents) {
      input = stripDiacritics(input);
    }
    var filteredOptions = options.filter(function(option) {
      var candidate = (stringify || getOptionLabel)(option);
      if (ignoreCase) {
        candidate = candidate.toLowerCase();
      }
      if (ignoreAccents) {
        candidate = stripDiacritics(candidate);
      }
      return matchFrom === "start" ? candidate.indexOf(input) === 0 : candidate.indexOf(input) > -1;
    });
    return typeof limit === "number" ? filteredOptions.slice(0, limit) : filteredOptions;
  };
}
function findIndex(array, comp) {
  for (var i = 0; i < array.length; i += 1) {
    if (comp(array[i])) {
      return i;
    }
  }
  return -1;
}
var defaultFilterOptions = createFilterOptions();
var pageSize = 5;
function useAutocomplete(props) {
  var _props$autoComplete = props.autoComplete, autoComplete = _props$autoComplete === void 0 ? false : _props$autoComplete, _props$autoHighlight = props.autoHighlight, autoHighlight = _props$autoHighlight === void 0 ? false : _props$autoHighlight, _props$autoSelect = props.autoSelect, autoSelect = _props$autoSelect === void 0 ? false : _props$autoSelect, _props$blurOnSelect = props.blurOnSelect, blurOnSelect = _props$blurOnSelect === void 0 ? false : _props$blurOnSelect, _props$clearOnBlur = props.clearOnBlur, clearOnBlur = _props$clearOnBlur === void 0 ? !props.freeSolo : _props$clearOnBlur, _props$clearOnEscape = props.clearOnEscape, clearOnEscape = _props$clearOnEscape === void 0 ? false : _props$clearOnEscape, _props$componentName = props.componentName, componentName = _props$componentName === void 0 ? "useAutocomplete" : _props$componentName, _props$debug = props.debug, debug = _props$debug === void 0 ? false : _props$debug, _props$defaultValue = props.defaultValue, defaultValue = _props$defaultValue === void 0 ? props.multiple ? [] : null : _props$defaultValue, _props$disableClearab = props.disableClearable, disableClearable = _props$disableClearab === void 0 ? false : _props$disableClearab, _props$disableCloseOn = props.disableCloseOnSelect, disableCloseOnSelect = _props$disableCloseOn === void 0 ? false : _props$disableCloseOn, _props$disabledItemsF = props.disabledItemsFocusable, disabledItemsFocusable = _props$disabledItemsF === void 0 ? false : _props$disabledItemsF, _props$disableListWra = props.disableListWrap, disableListWrap = _props$disableListWra === void 0 ? false : _props$disableListWra, _props$filterOptions = props.filterOptions, filterOptions = _props$filterOptions === void 0 ? defaultFilterOptions : _props$filterOptions, _props$filterSelected = props.filterSelectedOptions, filterSelectedOptions = _props$filterSelected === void 0 ? false : _props$filterSelected, _props$freeSolo = props.freeSolo, freeSolo = _props$freeSolo === void 0 ? false : _props$freeSolo, getOptionDisabled = props.getOptionDisabled, _props$getOptionLabel = props.getOptionLabel, getOptionLabelProp = _props$getOptionLabel === void 0 ? function(option) {
    return option;
  } : _props$getOptionLabel, _props$getOptionSelec = props.getOptionSelected, getOptionSelected = _props$getOptionSelec === void 0 ? function(option, value2) {
    return option === value2;
  } : _props$getOptionSelec, groupBy = props.groupBy, _props$handleHomeEndK = props.handleHomeEndKeys, handleHomeEndKeys = _props$handleHomeEndK === void 0 ? !props.freeSolo : _props$handleHomeEndK, idProp = props.id, _props$includeInputIn = props.includeInputInList, includeInputInList = _props$includeInputIn === void 0 ? false : _props$includeInputIn, inputValueProp = props.inputValue, _props$multiple = props.multiple, multiple = _props$multiple === void 0 ? false : _props$multiple, onChange = props.onChange, onClose = props.onClose, onHighlightChange = props.onHighlightChange, onInputChange = props.onInputChange, onOpen = props.onOpen, openProp = props.open, _props$openOnFocus = props.openOnFocus, openOnFocus = _props$openOnFocus === void 0 ? false : _props$openOnFocus, options = props.options, _props$selectOnFocus = props.selectOnFocus, selectOnFocus = _props$selectOnFocus === void 0 ? !props.freeSolo : _props$selectOnFocus, valueProp = props.value;
  var id = (0, import_utils3.unstable_useId)(idProp);
  var getOptionLabel = getOptionLabelProp;
  if (true) {
    getOptionLabel = function getOptionLabel2(option) {
      var optionLabel = getOptionLabelProp(option);
      if (typeof optionLabel !== "string") {
        var erroneousReturn = optionLabel === void 0 ? "undefined" : "".concat(_typeof(optionLabel), " (").concat(optionLabel, ")");
        console.error("Material-UI: The `getOptionLabel` method of ".concat(componentName, " returned ").concat(erroneousReturn, " instead of a string for ").concat(JSON.stringify(option), "."));
      }
      return optionLabel;
    };
  }
  var ignoreFocus = React3.useRef(false);
  var firstFocus = React3.useRef(true);
  var inputRef = React3.useRef(null);
  var listboxRef = React3.useRef(null);
  var _React$useState = React3.useState(null), anchorEl = _React$useState[0], setAnchorEl = _React$useState[1];
  var _React$useState2 = React3.useState(-1), focusedTag = _React$useState2[0], setFocusedTag = _React$useState2[1];
  var defaultHighlighted = autoHighlight ? 0 : -1;
  var highlightedIndexRef = React3.useRef(defaultHighlighted);
  var _useControlled = (0, import_utils3.useControlled)({
    controlled: valueProp,
    default: defaultValue,
    name: componentName
  }), _useControlled2 = _slicedToArray(_useControlled, 2), value = _useControlled2[0], setValue = _useControlled2[1];
  var _useControlled3 = (0, import_utils3.useControlled)({
    controlled: inputValueProp,
    default: "",
    name: componentName,
    state: "inputValue"
  }), _useControlled4 = _slicedToArray(_useControlled3, 2), inputValue = _useControlled4[0], setInputValue = _useControlled4[1];
  var _React$useState3 = React3.useState(false), focused = _React$useState3[0], setFocused = _React$useState3[1];
  var resetInputValue = (0, import_utils3.useEventCallback)(function(event, newValue) {
    var newInputValue;
    if (multiple) {
      newInputValue = "";
    } else if (newValue == null) {
      newInputValue = "";
    } else {
      var optionLabel = getOptionLabel(newValue);
      newInputValue = typeof optionLabel === "string" ? optionLabel : "";
    }
    if (inputValue === newInputValue) {
      return;
    }
    setInputValue(newInputValue);
    if (onInputChange) {
      onInputChange(event, newInputValue, "reset");
    }
  });
  React3.useEffect(function() {
    resetInputValue(null, value);
  }, [value, resetInputValue]);
  var _useControlled5 = (0, import_utils3.useControlled)({
    controlled: openProp,
    default: false,
    name: componentName,
    state: "open"
  }), _useControlled6 = _slicedToArray(_useControlled5, 2), open = _useControlled6[0], setOpenState = _useControlled6[1];
  var inputValueIsSelectedValue = !multiple && value != null && inputValue === getOptionLabel(value);
  var popupOpen = open;
  var filteredOptions = popupOpen ? filterOptions(options.filter(function(option) {
    if (filterSelectedOptions && (multiple ? value : [value]).some(function(value2) {
      return value2 !== null && getOptionSelected(option, value2);
    })) {
      return false;
    }
    return true;
  }), {
    inputValue: inputValueIsSelectedValue ? "" : inputValue,
    getOptionLabel
  }) : [];
  if (true) {
    if (value !== null && !freeSolo && options.length > 0) {
      var missingValue = (multiple ? value : [value]).filter(function(value2) {
        return !options.some(function(option) {
          return getOptionSelected(option, value2);
        });
      });
      if (missingValue.length > 0) {
        console.warn(["Material-UI: The value provided to ".concat(componentName, " is invalid."), "None of the options match with `".concat(missingValue.length > 1 ? JSON.stringify(missingValue) : JSON.stringify(missingValue[0]), "`."), "You can use the `getOptionSelected` prop to customize the equality test."].join("\n"));
      }
    }
  }
  var focusTag = (0, import_utils3.useEventCallback)(function(tagToFocus) {
    if (tagToFocus === -1) {
      inputRef.current.focus();
    } else {
      anchorEl.querySelector('[data-tag-index="'.concat(tagToFocus, '"]')).focus();
    }
  });
  React3.useEffect(function() {
    if (multiple && focusedTag > value.length - 1) {
      setFocusedTag(-1);
      focusTag(-1);
    }
  }, [value, multiple, focusedTag, focusTag]);
  function validOptionIndex(index, direction) {
    if (!listboxRef.current || index === -1) {
      return -1;
    }
    var nextFocus = index;
    while (true) {
      if (direction === "next" && nextFocus === filteredOptions.length || direction === "previous" && nextFocus === -1) {
        return -1;
      }
      var option = listboxRef.current.querySelector('[data-option-index="'.concat(nextFocus, '"]'));
      var nextFocusDisabled = disabledItemsFocusable ? false : option && (option.disabled || option.getAttribute("aria-disabled") === "true");
      if (option && !option.hasAttribute("tabindex") || nextFocusDisabled) {
        nextFocus += direction === "next" ? 1 : -1;
      } else {
        return nextFocus;
      }
    }
  }
  var setHighlightedIndex = (0, import_utils3.useEventCallback)(function(_ref22) {
    var event = _ref22.event, index = _ref22.index, _ref2$reason = _ref22.reason, reason = _ref2$reason === void 0 ? "auto" : _ref2$reason;
    highlightedIndexRef.current = index;
    if (index === -1) {
      inputRef.current.removeAttribute("aria-activedescendant");
    } else {
      inputRef.current.setAttribute("aria-activedescendant", "".concat(id, "-option-").concat(index));
    }
    if (onHighlightChange) {
      onHighlightChange(event, index === -1 ? null : filteredOptions[index], reason);
    }
    if (!listboxRef.current) {
      return;
    }
    var prev = listboxRef.current.querySelector("[data-focus]");
    if (prev) {
      prev.removeAttribute("data-focus");
    }
    var listboxNode = listboxRef.current.parentElement.querySelector('[role="listbox"]');
    if (!listboxNode) {
      return;
    }
    if (index === -1) {
      listboxNode.scrollTop = 0;
      return;
    }
    var option = listboxRef.current.querySelector('[data-option-index="'.concat(index, '"]'));
    if (!option) {
      return;
    }
    option.setAttribute("data-focus", "true");
    if (listboxNode.scrollHeight > listboxNode.clientHeight && reason !== "mouse") {
      var element = option;
      var scrollBottom = listboxNode.clientHeight + listboxNode.scrollTop;
      var elementBottom = element.offsetTop + element.offsetHeight;
      if (elementBottom > scrollBottom) {
        listboxNode.scrollTop = elementBottom - listboxNode.clientHeight;
      } else if (element.offsetTop - element.offsetHeight * (groupBy ? 1.3 : 0) < listboxNode.scrollTop) {
        listboxNode.scrollTop = element.offsetTop - element.offsetHeight * (groupBy ? 1.3 : 0);
      }
    }
  });
  var changeHighlightedIndex = (0, import_utils3.useEventCallback)(function(_ref3) {
    var event = _ref3.event, diff = _ref3.diff, _ref3$direction = _ref3.direction, direction = _ref3$direction === void 0 ? "next" : _ref3$direction, _ref3$reason = _ref3.reason, reason = _ref3$reason === void 0 ? "auto" : _ref3$reason;
    if (!popupOpen) {
      return;
    }
    var getNextIndex = function getNextIndex2() {
      var maxIndex = filteredOptions.length - 1;
      if (diff === "reset") {
        return defaultHighlighted;
      }
      if (diff === "start") {
        return 0;
      }
      if (diff === "end") {
        return maxIndex;
      }
      var newIndex = highlightedIndexRef.current + diff;
      if (newIndex < 0) {
        if (newIndex === -1 && includeInputInList) {
          return -1;
        }
        if (disableListWrap && highlightedIndexRef.current !== -1 || Math.abs(diff) > 1) {
          return 0;
        }
        return maxIndex;
      }
      if (newIndex > maxIndex) {
        if (newIndex === maxIndex + 1 && includeInputInList) {
          return -1;
        }
        if (disableListWrap || Math.abs(diff) > 1) {
          return maxIndex;
        }
        return 0;
      }
      return newIndex;
    };
    var nextIndex = validOptionIndex(getNextIndex(), direction);
    setHighlightedIndex({
      index: nextIndex,
      reason,
      event
    });
    if (autoComplete && diff !== "reset") {
      if (nextIndex === -1) {
        inputRef.current.value = inputValue;
      } else {
        var option = getOptionLabel(filteredOptions[nextIndex]);
        inputRef.current.value = option;
        var index = option.toLowerCase().indexOf(inputValue.toLowerCase());
        if (index === 0 && inputValue.length > 0) {
          inputRef.current.setSelectionRange(inputValue.length, option.length);
        }
      }
    }
  });
  var syncHighlightedIndex = React3.useCallback(function() {
    if (!popupOpen) {
      return;
    }
    var valueItem = multiple ? value[0] : value;
    if (filteredOptions.length === 0 || valueItem == null) {
      changeHighlightedIndex({
        diff: "reset"
      });
      return;
    }
    if (!listboxRef.current) {
      return;
    }
    if (!filterSelectedOptions && valueItem != null) {
      var currentOption = filteredOptions[highlightedIndexRef.current];
      if (multiple && currentOption && findIndex(value, function(val) {
        return getOptionSelected(currentOption, val);
      }) !== -1) {
        return;
      }
      var itemIndex = findIndex(filteredOptions, function(optionItem) {
        return getOptionSelected(optionItem, valueItem);
      });
      if (itemIndex === -1) {
        changeHighlightedIndex({
          diff: "reset"
        });
      } else {
        setHighlightedIndex({
          index: itemIndex
        });
      }
      return;
    }
    if (highlightedIndexRef.current >= filteredOptions.length - 1) {
      setHighlightedIndex({
        index: filteredOptions.length - 1
      });
      return;
    }
    setHighlightedIndex({
      index: highlightedIndexRef.current
    });
  }, [
    filteredOptions.length === 0,
    multiple ? false : value,
    filterSelectedOptions,
    changeHighlightedIndex,
    setHighlightedIndex,
    popupOpen,
    inputValue,
    multiple
  ]);
  var handleListboxRef = (0, import_utils3.useEventCallback)(function(node) {
    (0, import_utils3.setRef)(listboxRef, node);
    if (!node) {
      return;
    }
    syncHighlightedIndex();
  });
  React3.useEffect(function() {
    syncHighlightedIndex();
  }, [syncHighlightedIndex]);
  var handleOpen = function handleOpen2(event) {
    if (open) {
      return;
    }
    setOpenState(true);
    if (onOpen) {
      onOpen(event);
    }
  };
  var handleClose = function handleClose2(event, reason) {
    if (!open) {
      return;
    }
    setOpenState(false);
    if (onClose) {
      onClose(event, reason);
    }
  };
  var handleValue = function handleValue2(event, newValue, reason, details) {
    if (value === newValue) {
      return;
    }
    if (onChange) {
      onChange(event, newValue, reason, details);
    }
    setValue(newValue);
  };
  var isTouch = React3.useRef(false);
  var selectNewValue = function selectNewValue2(event, option) {
    var reasonProp = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "select-option";
    var origin = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "options";
    var reason = reasonProp;
    var newValue = option;
    if (multiple) {
      newValue = Array.isArray(value) ? value.slice() : [];
      if (true) {
        var matches = newValue.filter(function(val) {
          return getOptionSelected(option, val);
        });
        if (matches.length > 1) {
          console.error(["Material-UI: The `getOptionSelected` method of ".concat(componentName, " do not handle the arguments correctly."), "The component expects a single value to match a given option but found ".concat(matches.length, " matches.")].join("\n"));
        }
      }
      var itemIndex = findIndex(newValue, function(valueItem) {
        return getOptionSelected(option, valueItem);
      });
      if (itemIndex === -1) {
        newValue.push(option);
      } else if (origin !== "freeSolo") {
        newValue.splice(itemIndex, 1);
        reason = "remove-option";
      }
    }
    resetInputValue(event, newValue);
    handleValue(event, newValue, reason, {
      option
    });
    if (!disableCloseOnSelect) {
      handleClose(event, reason);
    }
    if (blurOnSelect === true || blurOnSelect === "touch" && isTouch.current || blurOnSelect === "mouse" && !isTouch.current) {
      inputRef.current.blur();
    }
  };
  function validTagIndex(index, direction) {
    if (index === -1) {
      return -1;
    }
    var nextFocus = index;
    while (true) {
      if (direction === "next" && nextFocus === value.length || direction === "previous" && nextFocus === -1) {
        return -1;
      }
      var option = anchorEl.querySelector('[data-tag-index="'.concat(nextFocus, '"]'));
      if (option && (!option.hasAttribute("tabindex") || option.disabled || option.getAttribute("aria-disabled") === "true")) {
        nextFocus += direction === "next" ? 1 : -1;
      } else {
        return nextFocus;
      }
    }
  }
  var handleFocusTag = function handleFocusTag2(event, direction) {
    if (!multiple) {
      return;
    }
    handleClose(event, "toggleInput");
    var nextTag = focusedTag;
    if (focusedTag === -1) {
      if (inputValue === "" && direction === "previous") {
        nextTag = value.length - 1;
      }
    } else {
      nextTag += direction === "next" ? 1 : -1;
      if (nextTag < 0) {
        nextTag = 0;
      }
      if (nextTag === value.length) {
        nextTag = -1;
      }
    }
    nextTag = validTagIndex(nextTag, direction);
    setFocusedTag(nextTag);
    focusTag(nextTag);
  };
  var handleClear = function handleClear2(event) {
    ignoreFocus.current = true;
    setInputValue("");
    if (onInputChange) {
      onInputChange(event, "", "clear");
    }
    handleValue(event, multiple ? [] : null, "clear");
  };
  var handleKeyDown = function handleKeyDown2(other) {
    return function(event) {
      if (focusedTag !== -1 && ["ArrowLeft", "ArrowRight"].indexOf(event.key) === -1) {
        setFocusedTag(-1);
        focusTag(-1);
      }
      switch (event.key) {
        case "Home":
          if (popupOpen && handleHomeEndKeys) {
            event.preventDefault();
            changeHighlightedIndex({
              diff: "start",
              direction: "next",
              reason: "keyboard",
              event
            });
          }
          break;
        case "End":
          if (popupOpen && handleHomeEndKeys) {
            event.preventDefault();
            changeHighlightedIndex({
              diff: "end",
              direction: "previous",
              reason: "keyboard",
              event
            });
          }
          break;
        case "PageUp":
          event.preventDefault();
          changeHighlightedIndex({
            diff: -pageSize,
            direction: "previous",
            reason: "keyboard",
            event
          });
          handleOpen(event);
          break;
        case "PageDown":
          event.preventDefault();
          changeHighlightedIndex({
            diff: pageSize,
            direction: "next",
            reason: "keyboard",
            event
          });
          handleOpen(event);
          break;
        case "ArrowDown":
          event.preventDefault();
          changeHighlightedIndex({
            diff: 1,
            direction: "next",
            reason: "keyboard",
            event
          });
          handleOpen(event);
          break;
        case "ArrowUp":
          event.preventDefault();
          changeHighlightedIndex({
            diff: -1,
            direction: "previous",
            reason: "keyboard",
            event
          });
          handleOpen(event);
          break;
        case "ArrowLeft":
          handleFocusTag(event, "previous");
          break;
        case "ArrowRight":
          handleFocusTag(event, "next");
          break;
        case "Enter":
          if (event.which === 229) {
            break;
          }
          if (highlightedIndexRef.current !== -1 && popupOpen) {
            var option = filteredOptions[highlightedIndexRef.current];
            var disabled = getOptionDisabled ? getOptionDisabled(option) : false;
            event.preventDefault();
            if (disabled) {
              return;
            }
            selectNewValue(event, option, "select-option");
            if (autoComplete) {
              inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
            }
          } else if (freeSolo && inputValue !== "" && inputValueIsSelectedValue === false) {
            if (multiple) {
              event.preventDefault();
            }
            selectNewValue(event, inputValue, "create-option", "freeSolo");
          }
          break;
        case "Escape":
          if (popupOpen) {
            event.preventDefault();
            event.stopPropagation();
            handleClose(event, "escape");
          } else if (clearOnEscape && (inputValue !== "" || multiple && value.length > 0)) {
            event.preventDefault();
            event.stopPropagation();
            handleClear(event);
          }
          break;
        case "Backspace":
          if (multiple && inputValue === "" && value.length > 0) {
            var index = focusedTag === -1 ? value.length - 1 : focusedTag;
            var newValue = value.slice();
            newValue.splice(index, 1);
            handleValue(event, newValue, "remove-option", {
              option: value[index]
            });
          }
          break;
        default:
      }
      if (other.onKeyDown) {
        other.onKeyDown(event);
      }
    };
  };
  var handleFocus = function handleFocus2(event) {
    setFocused(true);
    if (openOnFocus && !ignoreFocus.current) {
      handleOpen(event);
    }
  };
  var handleBlur = function handleBlur2(event) {
    if (listboxRef.current !== null && document.activeElement === listboxRef.current.parentElement) {
      inputRef.current.focus();
      return;
    }
    setFocused(false);
    firstFocus.current = true;
    ignoreFocus.current = false;
    if (debug && inputValue !== "") {
      return;
    }
    if (autoSelect && highlightedIndexRef.current !== -1 && popupOpen) {
      selectNewValue(event, filteredOptions[highlightedIndexRef.current], "blur");
    } else if (autoSelect && freeSolo && inputValue !== "") {
      selectNewValue(event, inputValue, "blur", "freeSolo");
    } else if (clearOnBlur) {
      resetInputValue(event, value);
    }
    handleClose(event, "blur");
  };
  var handleInputChange = function handleInputChange2(event) {
    var newValue = event.target.value;
    if (inputValue !== newValue) {
      setInputValue(newValue);
      if (onInputChange) {
        onInputChange(event, newValue, "input");
      }
    }
    if (newValue === "") {
      if (!disableClearable && !multiple) {
        handleValue(event, null, "clear");
      }
    } else {
      handleOpen(event);
    }
  };
  var handleOptionMouseOver = function handleOptionMouseOver2(event) {
    setHighlightedIndex({
      event,
      index: Number(event.currentTarget.getAttribute("data-option-index")),
      reason: "mouse"
    });
  };
  var handleOptionTouchStart = function handleOptionTouchStart2() {
    isTouch.current = true;
  };
  var handleOptionClick = function handleOptionClick2(event) {
    var index = Number(event.currentTarget.getAttribute("data-option-index"));
    selectNewValue(event, filteredOptions[index], "select-option");
    isTouch.current = false;
  };
  var handleTagDelete = function handleTagDelete2(index) {
    return function(event) {
      var newValue = value.slice();
      newValue.splice(index, 1);
      handleValue(event, newValue, "remove-option", {
        option: value[index]
      });
    };
  };
  var handlePopupIndicator = function handlePopupIndicator2(event) {
    if (open) {
      handleClose(event, "toggleInput");
    } else {
      handleOpen(event);
    }
  };
  var handleMouseDown = function handleMouseDown2(event) {
    if (event.target.getAttribute("id") !== id) {
      event.preventDefault();
    }
  };
  var handleClick = function handleClick2() {
    inputRef.current.focus();
    if (selectOnFocus && firstFocus.current && inputRef.current.selectionEnd - inputRef.current.selectionStart === 0) {
      inputRef.current.select();
    }
    firstFocus.current = false;
  };
  var handleInputMouseDown = function handleInputMouseDown2(event) {
    if (inputValue === "" || !open) {
      handlePopupIndicator(event);
    }
  };
  var dirty = freeSolo && inputValue.length > 0;
  dirty = dirty || (multiple ? value.length > 0 : value !== null);
  var groupedOptions = filteredOptions;
  if (groupBy) {
    var indexBy = new Map();
    var warn = false;
    groupedOptions = filteredOptions.reduce(function(acc, option, index) {
      var group = groupBy(option);
      if (acc.length > 0 && acc[acc.length - 1].group === group) {
        acc[acc.length - 1].options.push(option);
      } else {
        if (true) {
          if (indexBy.get(group) && !warn) {
            console.warn("Material-UI: The options provided combined with the `groupBy` method of ".concat(componentName, " returns duplicated headers."), "You can solve the issue by sorting the options with the output of `groupBy`.");
            warn = true;
          }
          indexBy.set(group, true);
        }
        acc.push({
          key: index,
          index,
          group,
          options: [option]
        });
      }
      return acc;
    }, []);
  }
  return {
    getRootProps: function getRootProps() {
      var other = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      return _extends({
        "aria-owns": popupOpen ? "".concat(id, "-popup") : null,
        role: "combobox",
        "aria-expanded": popupOpen
      }, other, {
        onKeyDown: handleKeyDown(other),
        onMouseDown: handleMouseDown,
        onClick: handleClick
      });
    },
    getInputLabelProps: function getInputLabelProps() {
      return {
        id: "".concat(id, "-label"),
        htmlFor: id
      };
    },
    getInputProps: function getInputProps() {
      return {
        id,
        value: inputValue,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onChange: handleInputChange,
        onMouseDown: handleInputMouseDown,
        "aria-activedescendant": popupOpen ? "" : null,
        "aria-autocomplete": autoComplete ? "both" : "list",
        "aria-controls": popupOpen ? "".concat(id, "-popup") : null,
        autoComplete: "off",
        ref: inputRef,
        autoCapitalize: "none",
        spellCheck: "false"
      };
    },
    getClearProps: function getClearProps() {
      return {
        tabIndex: -1,
        onClick: handleClear
      };
    },
    getPopupIndicatorProps: function getPopupIndicatorProps() {
      return {
        tabIndex: -1,
        onClick: handlePopupIndicator
      };
    },
    getTagProps: function getTagProps(_ref4) {
      var index = _ref4.index;
      return {
        key: index,
        "data-tag-index": index,
        tabIndex: -1,
        onDelete: handleTagDelete(index)
      };
    },
    getListboxProps: function getListboxProps() {
      return {
        role: "listbox",
        id: "".concat(id, "-popup"),
        "aria-labelledby": "".concat(id, "-label"),
        ref: handleListboxRef,
        onMouseDown: function onMouseDown(event) {
          event.preventDefault();
        }
      };
    },
    getOptionProps: function getOptionProps(_ref5) {
      var index = _ref5.index, option = _ref5.option;
      var selected = (multiple ? value : [value]).some(function(value2) {
        return value2 != null && getOptionSelected(option, value2);
      });
      var disabled = getOptionDisabled ? getOptionDisabled(option) : false;
      return {
        key: index,
        tabIndex: -1,
        role: "option",
        id: "".concat(id, "-option-").concat(index),
        onMouseOver: handleOptionMouseOver,
        onClick: handleOptionClick,
        onTouchStart: handleOptionTouchStart,
        "data-option-index": index,
        "aria-disabled": disabled,
        "aria-selected": selected
      };
    },
    id,
    inputValue,
    value,
    dirty,
    popupOpen,
    focused: focused || focusedTag !== -1,
    anchorEl,
    setAnchorEl,
    focusedTag,
    groupedOptions
  };
}

// node_modules/@material-ui/lab/esm/Autocomplete/Autocomplete.js
var styles = function styles2(theme) {
  var _option;
  return {
    root: {
      "&$focused $clearIndicatorDirty": {
        visibility: "visible"
      },
      "@media (pointer: fine)": {
        "&:hover $clearIndicatorDirty": {
          visibility: "visible"
        }
      }
    },
    fullWidth: {
      width: "100%"
    },
    focused: {},
    tag: {
      margin: 3,
      maxWidth: "calc(100% - 6px)"
    },
    tagSizeSmall: {
      margin: 2,
      maxWidth: "calc(100% - 4px)"
    },
    hasPopupIcon: {},
    hasClearIcon: {},
    inputRoot: {
      flexWrap: "wrap",
      "$hasPopupIcon &, $hasClearIcon &": {
        paddingRight: 26 + 4
      },
      "$hasPopupIcon$hasClearIcon &": {
        paddingRight: 52 + 4
      },
      "& $input": {
        width: 0,
        minWidth: 30
      },
      '&[class*="MuiInput-root"]': {
        paddingBottom: 1,
        "& $input": {
          padding: 4
        },
        "& $input:first-child": {
          padding: "6px 0"
        }
      },
      '&[class*="MuiInput-root"][class*="MuiInput-marginDense"]': {
        "& $input": {
          padding: "4px 4px 5px"
        },
        "& $input:first-child": {
          padding: "3px 0 6px"
        }
      },
      '&[class*="MuiOutlinedInput-root"]': {
        padding: 9,
        "$hasPopupIcon &, $hasClearIcon &": {
          paddingRight: 26 + 4 + 9
        },
        "$hasPopupIcon$hasClearIcon &": {
          paddingRight: 52 + 4 + 9
        },
        "& $input": {
          padding: "9.5px 4px"
        },
        "& $input:first-child": {
          paddingLeft: 6
        },
        "& $endAdornment": {
          right: 9
        }
      },
      '&[class*="MuiOutlinedInput-root"][class*="MuiOutlinedInput-marginDense"]': {
        padding: 6,
        "& $input": {
          padding: "4.5px 4px"
        }
      },
      '&[class*="MuiFilledInput-root"]': {
        paddingTop: 19,
        paddingLeft: 8,
        "$hasPopupIcon &, $hasClearIcon &": {
          paddingRight: 26 + 4 + 9
        },
        "$hasPopupIcon$hasClearIcon &": {
          paddingRight: 52 + 4 + 9
        },
        "& $input": {
          padding: "9px 4px"
        },
        "& $endAdornment": {
          right: 9
        }
      },
      '&[class*="MuiFilledInput-root"][class*="MuiFilledInput-marginDense"]': {
        paddingBottom: 1,
        "& $input": {
          padding: "4.5px 4px"
        }
      }
    },
    input: {
      flexGrow: 1,
      textOverflow: "ellipsis",
      opacity: 0
    },
    inputFocused: {
      opacity: 1
    },
    endAdornment: {
      position: "absolute",
      right: 0,
      top: "calc(50% - 14px)"
    },
    clearIndicator: {
      marginRight: -2,
      padding: 4,
      visibility: "hidden"
    },
    clearIndicatorDirty: {},
    popupIndicator: {
      padding: 2,
      marginRight: -2
    },
    popupIndicatorOpen: {
      transform: "rotate(180deg)"
    },
    popper: {
      zIndex: theme.zIndex.modal
    },
    popperDisablePortal: {
      position: "absolute"
    },
    paper: _extends({}, theme.typography.body1, {
      overflow: "hidden",
      margin: "4px 0"
    }),
    listbox: {
      listStyle: "none",
      margin: 0,
      padding: "8px 0",
      maxHeight: "40vh",
      overflow: "auto"
    },
    loading: {
      color: theme.palette.text.secondary,
      padding: "14px 16px"
    },
    noOptions: {
      color: theme.palette.text.secondary,
      padding: "14px 16px"
    },
    option: (_option = {
      minHeight: 48,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      cursor: "pointer",
      paddingTop: 6,
      boxSizing: "border-box",
      outline: "0",
      WebkitTapHighlightColor: "transparent",
      paddingBottom: 6,
      paddingLeft: 16,
      paddingRight: 16
    }, _defineProperty(_option, theme.breakpoints.up("sm"), {
      minHeight: "auto"
    }), _defineProperty(_option, '&[aria-selected="true"]', {
      backgroundColor: theme.palette.action.selected
    }), _defineProperty(_option, '&[data-focus="true"]', {
      backgroundColor: theme.palette.action.hover
    }), _defineProperty(_option, "&:active", {
      backgroundColor: theme.palette.action.selected
    }), _defineProperty(_option, '&[aria-disabled="true"]', {
      opacity: theme.palette.action.disabledOpacity,
      pointerEvents: "none"
    }), _option),
    groupLabel: {
      backgroundColor: theme.palette.background.paper,
      top: -8
    },
    groupUl: {
      padding: 0,
      "& $option": {
        paddingLeft: 24
      }
    }
  };
};
function DisablePortal(props) {
  var anchorEl = props.anchorEl, open = props.open, other = _objectWithoutProperties(props, ["anchorEl", "open"]);
  return /* @__PURE__ */ React4.createElement("div", other);
}
var _ref = /* @__PURE__ */ React4.createElement(Close_default, {
  fontSize: "small"
});
var _ref2 = /* @__PURE__ */ React4.createElement(ArrowDropDown_default, null);
var Autocomplete = /* @__PURE__ */ React4.forwardRef(function Autocomplete2(props, ref) {
  var _props$autoComplete = props.autoComplete, autoComplete = _props$autoComplete === void 0 ? false : _props$autoComplete, _props$autoHighlight = props.autoHighlight, autoHighlight = _props$autoHighlight === void 0 ? false : _props$autoHighlight, _props$autoSelect = props.autoSelect, autoSelect = _props$autoSelect === void 0 ? false : _props$autoSelect, _props$blurOnSelect = props.blurOnSelect, blurOnSelect = _props$blurOnSelect === void 0 ? false : _props$blurOnSelect, ChipProps = props.ChipProps, classes = props.classes, className = props.className, _props$clearOnBlur = props.clearOnBlur, clearOnBlur = _props$clearOnBlur === void 0 ? !props.freeSolo : _props$clearOnBlur, _props$clearOnEscape = props.clearOnEscape, clearOnEscape = _props$clearOnEscape === void 0 ? false : _props$clearOnEscape, _props$clearText = props.clearText, clearText = _props$clearText === void 0 ? "Clear" : _props$clearText, _props$closeIcon = props.closeIcon, closeIcon = _props$closeIcon === void 0 ? _ref : _props$closeIcon, _props$closeText = props.closeText, closeText = _props$closeText === void 0 ? "Close" : _props$closeText, _props$debug = props.debug, debug = _props$debug === void 0 ? false : _props$debug, _props$defaultValue = props.defaultValue, defaultValue = _props$defaultValue === void 0 ? props.multiple ? [] : null : _props$defaultValue, _props$disableClearab = props.disableClearable, disableClearable = _props$disableClearab === void 0 ? false : _props$disableClearab, _props$disableCloseOn = props.disableCloseOnSelect, disableCloseOnSelect = _props$disableCloseOn === void 0 ? false : _props$disableCloseOn, _props$disabled = props.disabled, disabled = _props$disabled === void 0 ? false : _props$disabled, _props$disabledItemsF = props.disabledItemsFocusable, disabledItemsFocusable = _props$disabledItemsF === void 0 ? false : _props$disabledItemsF, _props$disableListWra = props.disableListWrap, disableListWrap = _props$disableListWra === void 0 ? false : _props$disableListWra, _props$disablePortal = props.disablePortal, disablePortal = _props$disablePortal === void 0 ? false : _props$disablePortal, filterOptions = props.filterOptions, _props$filterSelected = props.filterSelectedOptions, filterSelectedOptions = _props$filterSelected === void 0 ? false : _props$filterSelected, _props$forcePopupIcon = props.forcePopupIcon, forcePopupIcon = _props$forcePopupIcon === void 0 ? "auto" : _props$forcePopupIcon, _props$freeSolo = props.freeSolo, freeSolo = _props$freeSolo === void 0 ? false : _props$freeSolo, _props$fullWidth = props.fullWidth, fullWidth = _props$fullWidth === void 0 ? false : _props$fullWidth, _props$getLimitTagsTe = props.getLimitTagsText, getLimitTagsText = _props$getLimitTagsTe === void 0 ? function(more2) {
    return "+".concat(more2);
  } : _props$getLimitTagsTe, getOptionDisabled = props.getOptionDisabled, _props$getOptionLabel = props.getOptionLabel, getOptionLabel = _props$getOptionLabel === void 0 ? function(x) {
    return x;
  } : _props$getOptionLabel, getOptionSelected = props.getOptionSelected, groupBy = props.groupBy, _props$handleHomeEndK = props.handleHomeEndKeys, handleHomeEndKeys = _props$handleHomeEndK === void 0 ? !props.freeSolo : _props$handleHomeEndK, idProp = props.id, _props$includeInputIn = props.includeInputInList, includeInputInList = _props$includeInputIn === void 0 ? false : _props$includeInputIn, inputValueProp = props.inputValue, _props$limitTags = props.limitTags, limitTags = _props$limitTags === void 0 ? -1 : _props$limitTags, _props$ListboxCompone = props.ListboxComponent, ListboxComponent = _props$ListboxCompone === void 0 ? "ul" : _props$ListboxCompone, ListboxProps = props.ListboxProps, _props$loading = props.loading, loading = _props$loading === void 0 ? false : _props$loading, _props$loadingText = props.loadingText, loadingText = _props$loadingText === void 0 ? "Loading\u2026" : _props$loadingText, _props$multiple = props.multiple, multiple = _props$multiple === void 0 ? false : _props$multiple, _props$noOptionsText = props.noOptionsText, noOptionsText = _props$noOptionsText === void 0 ? "No options" : _props$noOptionsText, onChange = props.onChange, onClose = props.onClose, onHighlightChange = props.onHighlightChange, onInputChange = props.onInputChange, onOpen = props.onOpen, open = props.open, _props$openOnFocus = props.openOnFocus, openOnFocus = _props$openOnFocus === void 0 ? false : _props$openOnFocus, _props$openText = props.openText, openText = _props$openText === void 0 ? "Open" : _props$openText, options = props.options, _props$PaperComponent = props.PaperComponent, PaperComponent = _props$PaperComponent === void 0 ? import_Paper.default : _props$PaperComponent, _props$PopperComponen = props.PopperComponent, PopperComponentProp = _props$PopperComponen === void 0 ? import_Popper.default : _props$PopperComponen, _props$popupIcon = props.popupIcon, popupIcon = _props$popupIcon === void 0 ? _ref2 : _props$popupIcon, renderGroupProp = props.renderGroup, renderInput = props.renderInput, renderOptionProp = props.renderOption, renderTags = props.renderTags, _props$selectOnFocus = props.selectOnFocus, selectOnFocus = _props$selectOnFocus === void 0 ? !props.freeSolo : _props$selectOnFocus, _props$size = props.size, size = _props$size === void 0 ? "medium" : _props$size, valueProp = props.value, other = _objectWithoutProperties(props, ["autoComplete", "autoHighlight", "autoSelect", "blurOnSelect", "ChipProps", "classes", "className", "clearOnBlur", "clearOnEscape", "clearText", "closeIcon", "closeText", "debug", "defaultValue", "disableClearable", "disableCloseOnSelect", "disabled", "disabledItemsFocusable", "disableListWrap", "disablePortal", "filterOptions", "filterSelectedOptions", "forcePopupIcon", "freeSolo", "fullWidth", "getLimitTagsText", "getOptionDisabled", "getOptionLabel", "getOptionSelected", "groupBy", "handleHomeEndKeys", "id", "includeInputInList", "inputValue", "limitTags", "ListboxComponent", "ListboxProps", "loading", "loadingText", "multiple", "noOptionsText", "onChange", "onClose", "onHighlightChange", "onInputChange", "onOpen", "open", "openOnFocus", "openText", "options", "PaperComponent", "PopperComponent", "popupIcon", "renderGroup", "renderInput", "renderOption", "renderTags", "selectOnFocus", "size", "value"]);
  var PopperComponent = disablePortal ? DisablePortal : PopperComponentProp;
  var _useAutocomplete = useAutocomplete(_extends({}, props, {
    componentName: "Autocomplete"
  })), getRootProps = _useAutocomplete.getRootProps, getInputProps = _useAutocomplete.getInputProps, getInputLabelProps = _useAutocomplete.getInputLabelProps, getPopupIndicatorProps = _useAutocomplete.getPopupIndicatorProps, getClearProps = _useAutocomplete.getClearProps, getTagProps = _useAutocomplete.getTagProps, getListboxProps = _useAutocomplete.getListboxProps, getOptionProps = _useAutocomplete.getOptionProps, value = _useAutocomplete.value, dirty = _useAutocomplete.dirty, id = _useAutocomplete.id, popupOpen = _useAutocomplete.popupOpen, focused = _useAutocomplete.focused, focusedTag = _useAutocomplete.focusedTag, anchorEl = _useAutocomplete.anchorEl, setAnchorEl = _useAutocomplete.setAnchorEl, inputValue = _useAutocomplete.inputValue, groupedOptions = _useAutocomplete.groupedOptions;
  var startAdornment;
  if (multiple && value.length > 0) {
    var getCustomizedTagProps = function getCustomizedTagProps2(params) {
      return _extends({
        className: (0, import_clsx.default)(classes.tag, size === "small" && classes.tagSizeSmall),
        disabled
      }, getTagProps(params));
    };
    if (renderTags) {
      startAdornment = renderTags(value, getCustomizedTagProps);
    } else {
      startAdornment = value.map(function(option, index) {
        return /* @__PURE__ */ React4.createElement(import_Chip.default, _extends({
          label: getOptionLabel(option),
          size
        }, getCustomizedTagProps({
          index
        }), ChipProps));
      });
    }
  }
  if (limitTags > -1 && Array.isArray(startAdornment)) {
    var more = startAdornment.length - limitTags;
    if (!focused && more > 0) {
      startAdornment = startAdornment.splice(0, limitTags);
      startAdornment.push(/* @__PURE__ */ React4.createElement("span", {
        className: classes.tag,
        key: startAdornment.length
      }, getLimitTagsText(more)));
    }
  }
  var defaultRenderGroup = function defaultRenderGroup2(params) {
    return /* @__PURE__ */ React4.createElement("li", {
      key: params.key
    }, /* @__PURE__ */ React4.createElement(import_ListSubheader.default, {
      className: classes.groupLabel,
      component: "div"
    }, params.group), /* @__PURE__ */ React4.createElement("ul", {
      className: classes.groupUl
    }, params.children));
  };
  var renderGroup = renderGroupProp || defaultRenderGroup;
  var renderOption = renderOptionProp || getOptionLabel;
  var renderListOption = function renderListOption2(option, index) {
    var optionProps = getOptionProps({
      option,
      index
    });
    return /* @__PURE__ */ React4.createElement("li", _extends({}, optionProps, {
      className: classes.option
    }), renderOption(option, {
      selected: optionProps["aria-selected"],
      inputValue
    }));
  };
  var hasClearIcon = !disableClearable && !disabled;
  var hasPopupIcon = (!freeSolo || forcePopupIcon === true) && forcePopupIcon !== false;
  return /* @__PURE__ */ React4.createElement(React4.Fragment, null, /* @__PURE__ */ React4.createElement("div", _extends({
    ref,
    className: (0, import_clsx.default)(classes.root, className, focused && classes.focused, fullWidth && classes.fullWidth, hasClearIcon && classes.hasClearIcon, hasPopupIcon && classes.hasPopupIcon)
  }, getRootProps(other)), renderInput({
    id,
    disabled,
    fullWidth: true,
    size: size === "small" ? "small" : void 0,
    InputLabelProps: getInputLabelProps(),
    InputProps: {
      ref: setAnchorEl,
      className: classes.inputRoot,
      startAdornment,
      endAdornment: /* @__PURE__ */ React4.createElement("div", {
        className: classes.endAdornment
      }, hasClearIcon ? /* @__PURE__ */ React4.createElement(import_IconButton.default, _extends({}, getClearProps(), {
        "aria-label": clearText,
        title: clearText,
        className: (0, import_clsx.default)(classes.clearIndicator, dirty && classes.clearIndicatorDirty)
      }), closeIcon) : null, hasPopupIcon ? /* @__PURE__ */ React4.createElement(import_IconButton.default, _extends({}, getPopupIndicatorProps(), {
        disabled,
        "aria-label": popupOpen ? closeText : openText,
        title: popupOpen ? closeText : openText,
        className: (0, import_clsx.default)(classes.popupIndicator, popupOpen && classes.popupIndicatorOpen)
      }), popupIcon) : null)
    },
    inputProps: _extends({
      className: (0, import_clsx.default)(classes.input, focusedTag === -1 && classes.inputFocused),
      disabled
    }, getInputProps())
  })), popupOpen && anchorEl ? /* @__PURE__ */ React4.createElement(PopperComponent, {
    className: (0, import_clsx.default)(classes.popper, disablePortal && classes.popperDisablePortal),
    style: {
      width: anchorEl ? anchorEl.clientWidth : null
    },
    role: "presentation",
    anchorEl,
    open: true
  }, /* @__PURE__ */ React4.createElement(PaperComponent, {
    className: classes.paper
  }, loading && groupedOptions.length === 0 ? /* @__PURE__ */ React4.createElement("div", {
    className: classes.loading
  }, loadingText) : null, groupedOptions.length === 0 && !freeSolo && !loading ? /* @__PURE__ */ React4.createElement("div", {
    className: classes.noOptions
  }, noOptionsText) : null, groupedOptions.length > 0 ? /* @__PURE__ */ React4.createElement(ListboxComponent, _extends({
    className: classes.listbox
  }, getListboxProps(), ListboxProps), groupedOptions.map(function(option, index) {
    if (groupBy) {
      return renderGroup({
        key: option.key,
        group: option.group,
        children: option.options.map(function(option2, index2) {
          return renderListOption(option2, option.index + index2);
        })
      });
    }
    return renderListOption(option, index);
  })) : null)) : null);
});
true ? Autocomplete.propTypes = {
  autoComplete: import_prop_types.default.bool,
  autoHighlight: import_prop_types.default.bool,
  autoSelect: import_prop_types.default.bool,
  blurOnSelect: import_prop_types.default.oneOfType([import_prop_types.default.oneOf(["mouse", "touch"]), import_prop_types.default.bool]),
  ChipProps: import_prop_types.default.object,
  classes: import_prop_types.default.object,
  className: import_prop_types.default.string,
  clearOnBlur: import_prop_types.default.bool,
  clearOnEscape: import_prop_types.default.bool,
  clearText: import_prop_types.default.string,
  closeIcon: import_prop_types.default.node,
  closeText: import_prop_types.default.string,
  debug: import_prop_types.default.bool,
  defaultValue: import_prop_types.default.any,
  disableClearable: import_prop_types.default.bool,
  disableCloseOnSelect: import_prop_types.default.bool,
  disabled: import_prop_types.default.bool,
  disabledItemsFocusable: import_prop_types.default.bool,
  disableListWrap: import_prop_types.default.bool,
  disablePortal: import_prop_types.default.bool,
  filterOptions: import_prop_types.default.func,
  filterSelectedOptions: import_prop_types.default.bool,
  forcePopupIcon: import_prop_types.default.oneOfType([import_prop_types.default.oneOf(["auto"]), import_prop_types.default.bool]),
  freeSolo: import_prop_types.default.bool,
  fullWidth: import_prop_types.default.bool,
  getLimitTagsText: import_prop_types.default.func,
  getOptionDisabled: import_prop_types.default.func,
  getOptionLabel: import_prop_types.default.func,
  getOptionSelected: import_prop_types.default.func,
  groupBy: import_prop_types.default.func,
  handleHomeEndKeys: import_prop_types.default.bool,
  id: import_prop_types.default.string,
  includeInputInList: import_prop_types.default.bool,
  inputValue: import_prop_types.default.string,
  limitTags: import_prop_types.default.number,
  ListboxComponent: import_prop_types.default.elementType,
  ListboxProps: import_prop_types.default.object,
  loading: import_prop_types.default.bool,
  loadingText: import_prop_types.default.node,
  multiple: import_prop_types.default.bool,
  noOptionsText: import_prop_types.default.node,
  onChange: import_prop_types.default.func,
  onClose: import_prop_types.default.func,
  onHighlightChange: import_prop_types.default.func,
  onInputChange: import_prop_types.default.func,
  onOpen: import_prop_types.default.func,
  open: import_prop_types.default.bool,
  openOnFocus: import_prop_types.default.bool,
  openText: import_prop_types.default.string,
  options: import_prop_types.default.array.isRequired,
  PaperComponent: import_prop_types.default.elementType,
  PopperComponent: import_prop_types.default.elementType,
  popupIcon: import_prop_types.default.node,
  renderGroup: import_prop_types.default.func,
  renderInput: import_prop_types.default.func.isRequired,
  renderOption: import_prop_types.default.func,
  renderTags: import_prop_types.default.func,
  selectOnFocus: import_prop_types.default.bool,
  size: import_prop_types.default.oneOf(["medium", "small"]),
  value: import_prop_types.default.any
} : void 0;
var Autocomplete_default = (0, import_styles.withStyles)(styles, {
  name: "MuiAutocomplete"
})(Autocomplete);

// admin/src/index.tsx
var import_TextField = __toModule(require_TextField());
var import_Typography2 = __toModule(require_Typography());
var import_Sync = __toModule(require_Sync());
var import_Button2 = __toModule(require_Button());
var import_Checkbox = __toModule(require_Checkbox());
var import_FormControlLabel = __toModule(require_FormControlLabel());

// admin/src/components/UpdateDeviceConfig.tsx
var import_react = __toModule(require_react());
var import_hooks = __toModule(require_hooks());
var import_GetApp = __toModule(require_GetApp());
var import_Button = __toModule(require_Button());
var import_styles2 = __toModule(require_styles());
var import_Typography = __toModule(require_Typography());
var useStyles = (0, import_styles2.makeStyles)((theme) => ({
  button: {
    margin: theme.spacing(1, 0)
  }
}));
var UpdateDeviceConfig = () => {
  const {alive: adapterRunning, connected: driverReady} = (0, import_hooks.useAdapter)();
  const {translate: _} = (0, import_hooks.useI18n)();
  const classes = useStyles();
  const {namespace} = (0, import_hooks.useGlobals)();
  const api = useAPI();
  const [configUpdate] = (0, import_hooks.useIoBrokerState)({
    id: `${namespace}.info.configUpdate`
  });
  const [configVersion] = (0, import_hooks.useIoBrokerState)({
    id: `${namespace}.info.configVersion`
  });
  const [configUpdating] = (0, import_hooks.useIoBrokerState)({
    id: `${namespace}.info.configUpdating`
  });
  const [busy, setBusy] = import_react.default.useState(false);
  async function update() {
    setBusy(true);
    const result = await api.updateConfig();
    setBusy(false);
    if (!result)
      alert(_("Updating the configuration DB failed!"));
  }
  if (!adapterRunning || !driverReady)
    return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null);
  if (!configUpdate) {
    return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_Typography.default, {
      variant: "body2"
    }, _("Configuration DB is up to date"), /* @__PURE__ */ import_react.default.createElement("br", null), _("Installed version"), ": ", configVersion));
  } else if (busy || configUpdating) {
    return /* @__PURE__ */ import_react.default.createElement(import_Typography.default, {
      variant: "body2"
    }, _("Updating configuration DB - please wait..."));
  }
  return /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement(import_Typography.default, {
    variant: "body2"
  }, _("Update for configuration DB available"), ": ", configUpdate), /* @__PURE__ */ import_react.default.createElement(import_Typography.default, {
    variant: "body2"
  }, _("Installed version"), ": ", configVersion), /* @__PURE__ */ import_react.default.createElement(import_Button.default, {
    className: classes.button,
    variant: "contained",
    color: "primary",
    onClick: () => update(),
    startIcon: /* @__PURE__ */ import_react.default.createElement(import_GetApp.default, null)
  }, _("Update configuration DB")), /* @__PURE__ */ import_react.default.createElement(import_Typography.default, {
    variant: "body2"
  }, _("config update disclaimer")));
};

// admin/src/components/TooltipIcon.tsx
var import_Tooltip = __toModule(require_Tooltip());
var import_react2 = __toModule(require_react());
var import_LiveHelp = __toModule(require_LiveHelp());
var import_styles3 = __toModule(require_styles());
var useStyles2 = (0, import_styles3.makeStyles)((theme) => ({
  tooltip: {
    verticalAlign: "middle"
  },
  icon: {
    color: theme.palette.text.hint,
    cursor: "help"
  }
}));
var TooltipIcon = (props) => {
  const classes = useStyles2();
  return /* @__PURE__ */ import_react2.default.createElement(import_Tooltip.default, {
    title: props.tooltip,
    className: classes.tooltip
  }, /* @__PURE__ */ import_react2.default.createElement(import_LiveHelp.default, {
    className: classes.icon
  }));
};

// admin/src/index.tsx
var useStyles3 = (0, import_styles4.makeStyles)((theme) => (0, import_styles4.createStyles)({
  root: {
    display: "flex",
    flexGrow: 1,
    flexFlow: "column nowrap",
    gap: theme.spacing(8)
  },
  keyGrid: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: theme.spacing(2)
  },
  keyGridLabel: {
    marginTop: theme.spacing(2),
    gridColumn: "1 / span 2"
  },
  keyGrid_TextField: {
    flexGrow: 1
  },
  keyGrid_Button: {
    flexGrow: 0
  }
}));
var networkKeyFields = [
  [
    2,
    "networkKey_S2_AccessControl",
    "S2 Access Control"
  ],
  [
    1,
    "networkKey_S2_Authenticated",
    "S2 Authenticated"
  ],
  [
    0,
    "networkKey_S2_Unauthenticated",
    "S2 Unauthenticated"
  ],
  [7, "networkKey_S0", "S0 (Legacy)"]
];
var SettingsPageContent = import_react3.default.memo(() => {
  const {settings, originalSettings, setSettings} = (0, import_hooks2.useSettings)();
  const classes = useStyles3();
  const {translate: _} = (0, import_hooks2.useI18n)();
  const api = useAPI();
  const handleChange = (option, value) => {
    setSettings((s) => ({
      ...s,
      [option]: value
    }));
  };
  const generateNetworkKey = (which) => {
    if (!settings[which] || settings[which] !== originalSettings[which] || confirm(_("network key confirm"))) {
      const bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      const hexKey = [...bytes].map((x) => x.toString(16).padStart(2, "0")).join("");
      handleChange(which, hexKey);
    }
  };
  const validateNetworkKey = (which) => {
    const networkKey = settings[which];
    if (!networkKey)
      return;
    if (!/[0-9a-fA-F]{32}/.test(networkKey)) {
      alert(_("Invalid network key"));
      handleChange(which, originalSettings[which]);
    }
  };
  const handleNetworkKeyPaste = (which, e) => {
    e.stopPropagation();
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    let pastedData = clipboardData.getData("Text");
    if (pastedData) {
      pastedData = pastedData.trim().replace(/0x/g, "").replace(/[^0-9a-fA-F]+/g, "").toLowerCase().slice(0, 32);
    }
    handleChange(which, pastedData);
  };
  const [serialPorts, setSerialPorts] = import_react3.default.useState([]);
  import_react3.default.useEffect(() => {
    api.listSerialPorts().then((ports) => {
      if (ports.length) {
        setSerialPorts(ports);
      }
    }).catch((e) => {
      console.error(`Cannot retrieve serial ports: ${e}`);
    });
  }, []);
  return /* @__PURE__ */ import_react3.default.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ import_react3.default.createElement(import_Grid.default, {
    container: true,
    spacing: 8
  }, /* @__PURE__ */ import_react3.default.createElement(import_Grid.default, {
    container: true,
    item: true,
    xs: 12,
    sm: true,
    spacing: 2,
    direction: "column"
  }, /* @__PURE__ */ import_react3.default.createElement(import_Grid.default, {
    item: true,
    xs: true
  }, /* @__PURE__ */ import_react3.default.createElement(Autocomplete_default, {
    options: serialPorts,
    freeSolo: true,
    forcePopupIcon: true,
    noOptionsText: "",
    autoSelect: true,
    clearOnBlur: true,
    onChange: (event, value) => handleChange("serialport", value ?? ""),
    renderInput: (props) => /* @__PURE__ */ import_react3.default.createElement(import_TextField.default, {
      ...props,
      label: _("Select serial port"),
      margin: "normal"
    }),
    value: settings.serialport
  }), /* @__PURE__ */ import_react3.default.createElement(import_Typography2.default, {
    variant: "body2"
  }, _("hosted port tip"))), /* @__PURE__ */ import_react3.default.createElement(import_Grid.default, {
    item: true,
    xs: true
  }, /* @__PURE__ */ import_react3.default.createElement(import_FormControlLabel.default, {
    label: _("Write a detailed logfile"),
    control: /* @__PURE__ */ import_react3.default.createElement(import_Checkbox.default, {
      checked: settings.writeLogFile,
      onChange: (event, checked) => handleChange("writeLogFile", checked)
    })
  }), /* @__PURE__ */ import_react3.default.createElement(import_Typography2.default, {
    variant: "body2"
  }, _("This should only be set for debugging purposes."))), /* @__PURE__ */ import_react3.default.createElement(import_Grid.default, {
    item: true,
    xs: true
  }, /* @__PURE__ */ import_react3.default.createElement(import_FormControlLabel.default, {
    label: _("Preserve state names"),
    control: /* @__PURE__ */ import_react3.default.createElement(import_Checkbox.default, {
      checked: settings.preserveStateNames,
      onChange: (event, checked) => handleChange("preserveStateNames", checked)
    })
  })), /* @__PURE__ */ import_react3.default.createElement(import_Grid.default, {
    item: true,
    xs: true
  }, /* @__PURE__ */ import_react3.default.createElement(import_FormControlLabel.default, {
    label: /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, _("Legacy switch compatibility"), " ", /* @__PURE__ */ import_react3.default.createElement(TooltipIcon, {
      tooltip: _("switch compat tooltip")
    })),
    control: /* @__PURE__ */ import_react3.default.createElement(import_Checkbox.default, {
      checked: settings.switchCompat,
      onChange: (event, checked) => handleChange("switchCompat", checked)
    })
  }))), /* @__PURE__ */ import_react3.default.createElement(import_Grid.default, {
    item: true,
    xs: 12,
    sm: 7,
    className: classes.keyGrid
  }, /* @__PURE__ */ import_react3.default.createElement(import_Typography2.default, {
    variant: "body1",
    className: classes.keyGridLabel
  }, _("Network keys for secure communication"), /* @__PURE__ */ import_react3.default.createElement(TooltipIcon, {
    tooltip: _("network key tooltip")
  })), networkKeyFields.map(([securityClass, property, label]) => /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, {
    key: `security-class-${securityClass}`
  }, /* @__PURE__ */ import_react3.default.createElement(import_TextField.default, {
    className: classes.keyGrid_TextField,
    label,
    inputProps: {
      maxLength: 32,
      style: {
        fontFamily: "monospace"
      },
      onPaste: handleNetworkKeyPaste.bind(void 0, property)
    },
    fullWidth: true,
    InputLabelProps: {
      shrink: !!settings[property]
    },
    value: settings[property],
    onChange: (event) => handleChange(property, event.target.value),
    onBlur: () => validateNetworkKey(property)
  }), /* @__PURE__ */ import_react3.default.createElement(import_Button2.default, {
    className: classes.keyGrid_Button,
    variant: "contained",
    color: "primary",
    startIcon: /* @__PURE__ */ import_react3.default.createElement(import_Sync.default, null),
    onClick: () => generateNetworkKey(property),
    style: {whiteSpace: "nowrap"}
  }, _("Generate key")))))), /* @__PURE__ */ import_react3.default.createElement(UpdateDeviceConfig, null));
});
var migrateSettings = (settings) => {
  if (settings.networkKey) {
    settings.networkKey_S0 = settings.networkKey;
    delete settings.networkKey;
  }
};
var translations = {
  en: require_en(),
  de: require_de(),
  ru: require_ru(),
  pt: require_pt(),
  nl: require_nl(),
  fr: require_fr(),
  it: require_it(),
  es: require_es(),
  pl: require_pl(),
  "zh-cn": require_zh_cn()
};
var Root = () => {
  return /* @__PURE__ */ import_react3.default.createElement(import_app.SettingsApp, {
    name: "zwave2",
    afterLoad: migrateSettings,
    translations
  }, /* @__PURE__ */ import_react3.default.createElement(SettingsPageContent, null));
};
import_react_dom.default.render(/* @__PURE__ */ import_react3.default.createElement(Root, null), document.getElementById("root"));
//# sourceMappingURL=index.js.map
