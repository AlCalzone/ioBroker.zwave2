import {
  __commonJS,
  __toModule,
  getErrorMessage,
  require_Box,
  require_Button,
  require_ButtonGroup,
  require_CheckCircle,
  require_Checkbox,
  require_CircularProgress,
  require_Close,
  require_Collapse,
  require_Dialog,
  require_DialogActions,
  require_DialogContent,
  require_DialogTitle,
  require_FormControlLabel,
  require_IconButton,
  require_LinearProgress,
  require_Loader,
  require_MenuItem,
  require_ModalDialog,
  require_OutlinedInput,
  require_Paper,
  require_Save,
  require_Select,
  require_Table,
  require_TableBody,
  require_TableCell,
  require_TableContainer,
  require_TableHead,
  require_TableRow,
  require_TextField,
  require_Tooltip,
  require_Typography,
  require_Warning,
  require_app,
  require_clsx,
  require_colors,
  require_core,
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
  require_pt,
  require_react,
  require_react_dom,
  require_ru,
  require_strings,
  require_styles,
  require_zh_cn,
  useAPI
} from "./chunk-QFE6BTOS.js";

// node_modules/iobroker-react/build/lib/components/Dropdown.js
var require_Dropdown = __commonJS({
  "node_modules/iobroker-react/build/lib/components/Dropdown.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, {enumerable: true, get: function() {
        return m[k];
      }});
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", {enumerable: true, value: v});
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __rest = exports && exports.__rest || function(s, e) {
      var t = {};
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : {"default": mod};
    };
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.Dropdown = void 0;
    var MenuItem_1 = __importDefault(require_MenuItem());
    var OutlinedInput_1 = __importDefault(require_OutlinedInput());
    var Select_1 = __importDefault(require_Select());
    var React21 = __importStar(require_react());
    var Dropdown3 = (props) => {
      const {options, selectedOption, noOptionsMessage, placeholder} = props, otherProps = __rest(props, ["options", "selectedOption", "noOptionsMessage", "placeholder"]);
      const hasOptions = !!options && options.length;
      const showNoOptionsMessage = !hasOptions && !!noOptionsMessage;
      let value;
      if (options === null || options === void 0 ? void 0 : options.length)
        value = selectedOption;
      return React21.createElement(Select_1.default, Object.assign({value: value !== null && value !== void 0 ? value : "", displayEmpty: true, input: React21.createElement(OutlinedInput_1.default, {labelWidth: 0}), margin: "dense"}, otherProps), React21.createElement(MenuItem_1.default, {value: "", disabled: true}, placeholder !== null && placeholder !== void 0 ? placeholder : ""), options && options.length && options.map(({value: value2, label}) => React21.createElement(MenuItem_1.default, {key: value2, value: value2}, label)), showNoOptionsMessage && React21.createElement(MenuItem_1.default, {key: "__empty", value: "__empty", disabled: true}, noOptionsMessage));
    };
    exports.Dropdown = Dropdown3;
  }
});

// node_modules/iobroker-react/build/components.js
var require_components = __commonJS({
  "node_modules/iobroker-react/build/components.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : {"default": mod};
    };
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.ModalDialog = exports.Loader = exports.Dropdown = void 0;
    var Dropdown_1 = require_Dropdown();
    Object.defineProperty(exports, "Dropdown", {enumerable: true, get: function() {
      return Dropdown_1.Dropdown;
    }});
    var Loader_1 = require_Loader();
    Object.defineProperty(exports, "Loader", {enumerable: true, get: function() {
      return __importDefault(Loader_1).default;
    }});
    var ModalDialog_1 = require_ModalDialog();
    Object.defineProperty(exports, "ModalDialog", {enumerable: true, get: function() {
      return ModalDialog_1.ModalDialog;
    }});
  }
});

// node_modules/@material-ui/icons/Add.js
var require_Add = __commonJS({
  "node_modules/@material-ui/icons/Add.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
    }), "Add");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/Restore.js
var require_Restore = __commonJS({
  "node_modules/@material-ui/icons/Restore.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
    }), "Restore");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/DeleteForever.js
var require_DeleteForever = __commonJS({
  "node_modules/@material-ui/icons/DeleteForever.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
    }), "DeleteForever");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/Wifi.js
var require_Wifi = __commonJS({
  "node_modules/@material-ui/icons/Wifi.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"
    }), "Wifi");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/WifiOff.js
var require_WifiOff = __commonJS({
  "node_modules/@material-ui/icons/WifiOff.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M22.99 9C19.15 5.16 13.8 3.76 8.84 4.78l2.52 2.52c3.47-.17 6.99 1.05 9.63 3.7l2-2zm-4 4c-1.29-1.29-2.84-2.13-4.49-2.56l3.53 3.53.96-.97zM2 3.05L5.07 6.1C3.6 6.82 2.22 7.78 1 9l1.99 2c1.24-1.24 2.67-2.16 4.2-2.77l2.24 2.24C7.81 10.89 6.27 11.73 5 13v.01L6.99 15c1.36-1.36 3.14-2.04 4.92-2.06L18.98 20l1.27-1.26L3.29 1.79 2 3.05zM9 17l3 3 3-3c-1.65-1.66-4.34-1.66-6 0z"
    }), "WifiOff");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/DeviceUnknown.js
var require_DeviceUnknown = __commonJS({
  "node_modules/@material-ui/icons/DeviceUnknown.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14zM12 6.72c-1.96 0-3.5 1.52-3.5 3.47h1.75c0-.93.82-1.75 1.75-1.75s1.75.82 1.75 1.75c0 1.75-2.63 1.57-2.63 4.45h1.76c0-1.96 2.62-2.19 2.62-4.45 0-1.96-1.54-3.47-3.5-3.47zm-.88 8.8h1.76v1.76h-1.76z"
    }), "DeviceUnknown");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/PowerSettingsNew.js
var require_PowerSettingsNew = __commonJS({
  "node_modules/@material-ui/icons/PowerSettingsNew.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"
    }), "PowerSettingsNew");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/Remove.js
var require_Remove = __commonJS({
  "node_modules/@material-ui/icons/Remove.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M19 13H5v-2h14v2z"
    }), "Remove");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/NetworkCheck.js
var require_NetworkCheck = __commonJS({
  "node_modules/@material-ui/icons/NetworkCheck.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M15.9 5c-.17 0-.32.09-.41.23l-.07.15-5.18 11.65c-.16.29-.26.61-.26.96 0 1.11.9 2.01 2.01 2.01.96 0 1.77-.68 1.96-1.59l.01-.03L16.4 5.5c0-.28-.22-.5-.5-.5zM1 9l2 2c2.88-2.88 6.79-4.08 10.53-3.62l1.19-2.68C9.89 3.84 4.74 5.27 1 9zm20 2l2-2c-1.64-1.64-3.55-2.82-5.59-3.57l-.53 2.82c1.5.62 2.9 1.53 4.12 2.75zm-4 4l2-2c-.8-.8-1.7-1.42-2.66-1.89l-.55 2.92c.42.27.83.59 1.21.97zM5 13l2 2c1.13-1.13 2.56-1.79 4.03-2l1.28-2.88c-2.63-.08-5.3.87-7.31 2.88z"
    }), "NetworkCheck");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/Done.js
var require_Done = __commonJS({
  "node_modules/@material-ui/icons/Done.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
    }), "Done");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/Redo.js
var require_Redo = __commonJS({
  "node_modules/@material-ui/icons/Redo.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"
    }), "Redo");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/ErrorOutline.js
var require_ErrorOutline = __commonJS({
  "node_modules/@material-ui/icons/ErrorOutline.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
    }), "ErrorOutline");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/Autorenew.js
var require_Autorenew = __commonJS({
  "node_modules/@material-ui/icons/Autorenew.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"
    }), "Autorenew");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/KeyboardArrowDown.js
var require_KeyboardArrowDown = __commonJS({
  "node_modules/@material-ui/icons/KeyboardArrowDown.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
    }), "KeyboardArrowDown");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/KeyboardArrowUp.js
var require_KeyboardArrowUp = __commonJS({
  "node_modules/@material-ui/icons/KeyboardArrowUp.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
    }), "KeyboardArrowUp");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/Publish.js
var require_Publish = __commonJS({
  "node_modules/@material-ui/icons/Publish.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z"
    }), "Publish");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/RestorePage.js
var require_RestorePage = __commonJS({
  "node_modules/@material-ui/icons/RestorePage.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16c-2.05 0-3.81-1.24-4.58-3h1.71c.63.9 1.68 1.5 2.87 1.5 1.93 0 3.5-1.57 3.5-3.5S13.93 9.5 12 9.5c-1.35 0-2.52.78-3.1 1.9l1.6 1.6h-4V9l1.3 1.3C8.69 8.92 10.23 8 12 8c2.76 0 5 2.24 5 5s-2.24 5-5 5z"
    }), "RestorePage");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/Memory.js
var require_Memory = __commonJS({
  "node_modules/@material-ui/icons/Memory.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M15 9H9v6h6V9zm-2 4h-2v-2h2v2zm8-2V9h-2V7c0-1.1-.9-2-2-2h-2V3h-2v2h-2V3H9v2H7c-1.1 0-2 .9-2 2v2H3v2h2v2H3v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2zm-4 6H7V7h10v10z"
    }), "Memory");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/DeleteOutline.js
var require_DeleteOutline = __commonJS({
  "node_modules/@material-ui/icons/DeleteOutline.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
    }), "DeleteOutline");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/Lock.js
var require_Lock = __commonJS({
  "node_modules/@material-ui/icons/Lock.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
    }), "Lock");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/NoEncryption.js
var require_NoEncryption = __commonJS({
  "node_modules/@material-ui/icons/NoEncryption.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M21 21.78L4.22 5 3 6.22l2.04 2.04C4.42 8.6 4 9.25 4 10v10c0 1.1.9 2 2 2h12c.23 0 .45-.05.66-.12L19.78 23 21 21.78zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H9.66L20 18.34V10c0-1.1-.9-2-2-2h-1V6c0-2.76-2.24-5-5-5-2.56 0-4.64 1.93-4.94 4.4L8.9 7.24V6z"
    }), "NoEncryption");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/Home.js
var require_Home = __commonJS({
  "node_modules/@material-ui/icons/Home.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
    }), "Home");
    exports.default = _default;
  }
});

// node_modules/@material-ui/icons/Language.js
var require_Language = __commonJS({
  "node_modules/@material-ui/icons/Language.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    var _interopRequireWildcard = require_interopRequireWildcard();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React21 = _interopRequireWildcard(require_react());
    var _createSvgIcon = _interopRequireDefault(require_createSvgIcon());
    var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ React21.createElement("path", {
      d: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"
    }), "Language");
    exports.default = _default;
  }
});

// node_modules/react-error-boundary/dist/react-error-boundary.umd.js
var require_react_error_boundary_umd = __commonJS({
  "node_modules/react-error-boundary/dist/react-error-boundary.umd.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require_react()) : typeof define === "function" && define.amd ? define(["exports", "react"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.ReactErrorBoundary = {}, global.React));
    })(exports, function(exports2, React21) {
      "use strict";
      function _interopNamespace(e) {
        if (e && e.__esModule)
          return e;
        var n = Object.create(null);
        if (e) {
          Object.keys(e).forEach(function(k) {
            if (k !== "default") {
              var d = Object.getOwnPropertyDescriptor(e, k);
              Object.defineProperty(n, k, d.get ? d : {
                enumerable: true,
                get: function() {
                  return e[k];
                }
              });
            }
          });
        }
        n["default"] = e;
        return Object.freeze(n);
      }
      var React__namespace = /* @__PURE__ */ _interopNamespace(React21);
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
          o2.__proto__ = p2;
          return o2;
        };
        return _setPrototypeOf(o, p);
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      var changedArray = function changedArray2(a, b) {
        if (a === void 0) {
          a = [];
        }
        if (b === void 0) {
          b = [];
        }
        return a.length !== b.length || a.some(function(item, index) {
          return !Object.is(item, b[index]);
        });
      };
      var initialState = {
        error: null
      };
      var ErrorBoundary2 = /* @__PURE__ */ function(_React$Component) {
        _inheritsLoose(ErrorBoundary3, _React$Component);
        function ErrorBoundary3() {
          var _this;
          for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
            _args[_key] = arguments[_key];
          }
          _this = _React$Component.call.apply(_React$Component, [this].concat(_args)) || this;
          _this.state = initialState;
          _this.updatedWithError = false;
          _this.resetErrorBoundary = function() {
            var _this$props;
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }
            _this.props.onReset == null ? void 0 : (_this$props = _this.props).onReset.apply(_this$props, args);
            _this.reset();
          };
          return _this;
        }
        ErrorBoundary3.getDerivedStateFromError = function getDerivedStateFromError(error) {
          return {
            error
          };
        };
        var _proto = ErrorBoundary3.prototype;
        _proto.reset = function reset() {
          this.updatedWithError = false;
          this.setState(initialState);
        };
        _proto.componentDidCatch = function componentDidCatch(error, info) {
          var _this$props$onError, _this$props2;
          (_this$props$onError = (_this$props2 = this.props).onError) == null ? void 0 : _this$props$onError.call(_this$props2, error, info);
        };
        _proto.componentDidMount = function componentDidMount() {
          var error = this.state.error;
          if (error !== null) {
            this.updatedWithError = true;
          }
        };
        _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
          var error = this.state.error;
          var resetKeys = this.props.resetKeys;
          if (error !== null && !this.updatedWithError) {
            this.updatedWithError = true;
            return;
          }
          if (error !== null && changedArray(prevProps.resetKeys, resetKeys)) {
            var _this$props$onResetKe, _this$props3;
            (_this$props$onResetKe = (_this$props3 = this.props).onResetKeysChange) == null ? void 0 : _this$props$onResetKe.call(_this$props3, prevProps.resetKeys, resetKeys);
            this.reset();
          }
        };
        _proto.render = function render() {
          var error = this.state.error;
          var _this$props4 = this.props, fallbackRender = _this$props4.fallbackRender, FallbackComponent = _this$props4.FallbackComponent, fallback = _this$props4.fallback;
          if (error !== null) {
            var _props = {
              error,
              resetErrorBoundary: this.resetErrorBoundary
            };
            if (/* @__PURE__ */ React__namespace.isValidElement(fallback)) {
              return fallback;
            } else if (typeof fallbackRender === "function") {
              return fallbackRender(_props);
            } else if (FallbackComponent) {
              return /* @__PURE__ */ React__namespace.createElement(FallbackComponent, _props);
            } else {
              throw new Error("react-error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop");
            }
          }
          return this.props.children;
        };
        return ErrorBoundary3;
      }(React__namespace.Component);
      function withErrorBoundary(Component, errorBoundaryProps) {
        var Wrapped = function Wrapped2(props) {
          return /* @__PURE__ */ React__namespace.createElement(ErrorBoundary2, errorBoundaryProps, /* @__PURE__ */ React__namespace.createElement(Component, props));
        };
        var name = Component.displayName || Component.name || "Unknown";
        Wrapped.displayName = "withErrorBoundary(" + name + ")";
        return Wrapped;
      }
      function useErrorHandler(givenError) {
        var _React$useState = React__namespace.useState(null), error = _React$useState[0], setError = _React$useState[1];
        if (givenError != null)
          throw givenError;
        if (error != null)
          throw error;
        return setError;
      }
      exports2.ErrorBoundary = ErrorBoundary2;
      exports2.useErrorHandler = useErrorHandler;
      exports2.withErrorBoundary = withErrorBoundary;
      Object.defineProperty(exports2, "__esModule", {value: true});
    });
  }
});

// admin/src/tab.tsx
var import_core2 = __toModule(require_core());
var import_react20 = __toModule(require_react());
var import_react_dom = __toModule(require_react_dom());
var import_app = __toModule(require_app());

// admin/src/components/TabPanel.tsx
var import_Box = __toModule(require_Box());
var import_react = __toModule(require_react());
var TabPanel = (props) => {
  const {children: children2, value, index, ...other} = props;
  return /* @__PURE__ */ import_react.default.createElement("div", {
    role: "tabpanel",
    hidden: value !== index,
    ...other
  }, value === index && /* @__PURE__ */ import_react.default.createElement(import_Box.default, {
    p: 3
  }, children2));
};

// admin/src/pages/Associations.tsx
var import_react7 = __toModule(require_react());

// admin/src/components/AssociationNodeTable.tsx
var import_strings2 = __toModule(require_strings());
var import_react5 = __toModule(require_react());

// admin/src/components/AssociationRow.tsx
var import_react2 = __toModule(require_react());
var import_strings = __toModule(require_strings());
var import_hooks = __toModule(require_hooks());
var import_components = __toModule(require_components());
var import_ButtonGroup = __toModule(require_ButtonGroup());
var import_Tooltip = __toModule(require_Tooltip());
var import_Button = __toModule(require_Button());
var import_Add = __toModule(require_Add());
var import_Save = __toModule(require_Save());
var import_Restore = __toModule(require_Restore());
var import_DeleteForever = __toModule(require_DeleteForever());
var import_TableCell = __toModule(require_TableCell());
var import_TableRow = __toModule(require_TableRow());
var import_styles = __toModule(require_styles());
var useStyles = (0, import_styles.makeStyles)((_theme) => ({
  dropdown: {
    width: "100%"
  }
}));
var TableCell = (0, import_styles.styled)(import_TableCell.default)(({theme}) => ({
  padding: theme.spacing(1)
}));
var AssociationRow = (props) => {
  const {translate: _} = (0, import_hooks.useI18n)();
  const [sourceEndpoint, setSourceEndpoint] = import_react2.default.useState(props.sourceEndpoint);
  const [group, setGroup] = import_react2.default.useState(props.group);
  const [nodeId, setNodeId] = import_react2.default.useState(props.nodeId);
  const [endpoint, setEndpoint] = import_react2.default.useState(props.endpoint);
  const [isValid, setValid] = import_react2.default.useState(false);
  const [hasChanges, setHasChanges] = import_react2.default.useState(false);
  const [isBusy, setBusy] = import_react2.default.useState(false);
  const groups = sourceEndpoint != void 0 && props.groups.get(sourceEndpoint) || [];
  import_react2.default.useEffect(() => {
    setHasChanges(sourceEndpoint !== props.sourceEndpoint || group !== props.group || nodeId !== props.nodeId || endpoint !== props.endpoint);
    const groupExists = !!groups.find((g) => g.group === group);
    const node = props.nodes.find((n) => n.nodeId === nodeId);
    const endpointIndizes = node?.endpointIndizes ?? [];
    setValid(groupExists && !!node && (endpoint == void 0 || endpoint === 0 || endpointIndizes.includes(endpoint)));
  }, [group, groups, nodeId, endpoint]);
  const groupOptions = groups.map(({group: group2, label}) => ({
    value: group2,
    label: `${_("Group")} ${group2}: ${label}`
  }));
  const nodesOptions = props.nodes.map(({nodeId: nodeId2}) => ({
    value: nodeId2,
    label: `${_("Node")} ${(0, import_strings.padStart)(nodeId2.toString(), 3, "0")}`
  }));
  const sourceEndpointOptions = import_react2.default.useMemo(() => {
    const newEndpointOptions = [
      {value: 0, label: _("Root device")}
    ];
    for (const ep of props.endpoints) {
      if (ep === 0)
        continue;
      newEndpointOptions.push({
        value: ep,
        label: `${_("Endpoint")} ${ep}`
      });
    }
    return newEndpointOptions;
  }, [props.endpoints]);
  const targetEndpointOptions = import_react2.default.useMemo(() => {
    const endpointIndizes = props.nodes.find((n) => n.nodeId === nodeId)?.endpointIndizes ?? [];
    if (!endpointIndizes.includes(0))
      endpointIndizes.unshift(0);
    const groupSupportsMultiChannel = !!groups.find((g) => g.group === group)?.multiChannel;
    if (!groupSupportsMultiChannel) {
      return [];
    } else {
      const newEndpointOptions = [
        {value: "none", label: _("Root device")}
      ];
      for (const ep of endpointIndizes) {
        newEndpointOptions.push({
          value: ep,
          label: ep === 0 ? _("Root endpoint") : `${_("Endpoint")} ${ep}`
        });
      }
      return newEndpointOptions;
    }
  }, [props.nodes, groups, group, nodeId]);
  const isNewAssociation = props.sourceEndpoint == void 0 && props.group == void 0 && props.nodeId == void 0 && props.endpoint == void 0;
  async function saveAssociation() {
    try {
      setBusy(true);
      await props.save(sourceEndpoint, group, nodeId, endpoint);
      if (isNewAssociation)
        resetAssociation();
    } catch (e) {
      alert(_(`The association could not be saved!`));
      console.error(`The association could not be saved! Reason: ${getErrorMessage(e)}`);
      resetAssociation();
    } finally {
      setBusy(false);
    }
  }
  function resetAssociation() {
    setSourceEndpoint(props.sourceEndpoint);
    setGroup(props.group);
    setNodeId(props.nodeId);
    setEndpoint(props.endpoint);
  }
  async function deleteAssociation() {
    if (!props.delete)
      return;
    try {
      setBusy(true);
      await props.delete();
    } catch (e) {
      alert(_(`The association could not be deleted!`));
      console.error(`The association could not be deleted! Reason: ${getErrorMessage(e)}`);
      resetAssociation();
    } finally {
      setBusy(false);
    }
  }
  const currentGroup = groups.find((g) => g.group === group);
  const endpointSupportsMultiChannel = groups.some((g) => g.multiChannel);
  const classes = useStyles();
  return /* @__PURE__ */ import_react2.default.createElement(import_TableRow.default, null, /* @__PURE__ */ import_react2.default.createElement(TableCell, null, /* @__PURE__ */ import_react2.default.createElement(import_components.Dropdown, {
    className: classes.dropdown,
    options: sourceEndpointOptions,
    selectedOption: sourceEndpoint ?? "",
    placeholder: _("- select endpoint -"),
    onChange: (e) => {
      setSourceEndpoint(e.target.value);
    }
  })), /* @__PURE__ */ import_react2.default.createElement(TableCell, null, /* @__PURE__ */ import_react2.default.createElement(import_components.Dropdown, {
    className: classes.dropdown,
    options: groupOptions,
    selectedOption: group,
    placeholder: _("- select group -"),
    onChange: (e) => {
      setGroup(e.target.value);
    }
  })), /* @__PURE__ */ import_react2.default.createElement(TableCell, null, /* @__PURE__ */ import_react2.default.createElement(import_components.Dropdown, {
    className: classes.dropdown,
    options: nodesOptions,
    selectedOption: nodeId,
    placeholder: _("- select node -"),
    onChange: (e) => {
      setNodeId(e.target.value);
    }
  })), props.supportsMultiChannel && /* @__PURE__ */ import_react2.default.createElement(TableCell, null, currentGroup?.multiChannel && endpointSupportsMultiChannel && /* @__PURE__ */ import_react2.default.createElement(import_components.Dropdown, {
    className: classes.dropdown,
    options: targetEndpointOptions,
    selectedOption: endpoint ?? "none",
    placeholder: _("- select endpoint -"),
    onChange: (e) => {
      const value = e.target.value;
      setEndpoint(value === "none" ? void 0 : value);
    }
  })), /* @__PURE__ */ import_react2.default.createElement(TableCell, null, /* @__PURE__ */ import_react2.default.createElement(import_ButtonGroup.default, {
    variant: "contained",
    color: "primary",
    style: {flex: "1 0 auto"}
  }, /* @__PURE__ */ import_react2.default.createElement(import_Tooltip.default, {
    title: _("Save association")
  }, /* @__PURE__ */ import_react2.default.createElement(import_Button.default, {
    disabled: isBusy || !isValid || !hasChanges,
    onClick: () => saveAssociation()
  }, isNewAssociation ? /* @__PURE__ */ import_react2.default.createElement(import_Add.default, null) : /* @__PURE__ */ import_react2.default.createElement(import_Save.default, null))), /* @__PURE__ */ import_react2.default.createElement(import_Tooltip.default, {
    title: _("Undo changes")
  }, /* @__PURE__ */ import_react2.default.createElement(import_Button.default, {
    disabled: isBusy || !hasChanges,
    onClick: () => resetAssociation()
  }, /* @__PURE__ */ import_react2.default.createElement(import_Restore.default, null))), !isNewAssociation && /* @__PURE__ */ import_react2.default.createElement(import_Tooltip.default, {
    title: _("Delete association")
  }, /* @__PURE__ */ import_react2.default.createElement(import_Button.default, {
    disabled: isBusy,
    onClick: () => deleteAssociation()
  }, /* @__PURE__ */ import_react2.default.createElement(import_DeleteForever.default, null))))));
};

// admin/src/components/DeviceStatusIcon.tsx
var import_react3 = __toModule(require_react());
var import_hooks2 = __toModule(require_hooks());
var import_Tooltip2 = __toModule(require_Tooltip());
var import_colors = __toModule(require_colors());
var import_styles2 = __toModule(require_styles());
var import_Wifi = __toModule(require_Wifi());
var import_WifiOff = __toModule(require_WifiOff());
var import_DeviceUnknown = __toModule(require_DeviceUnknown());
var import_PowerSettingsNew = __toModule(require_PowerSettingsNew());
var useStyles2 = (0, import_styles2.makeStyles)((_theme) => ({
  deviceIconAlive: {
    color: import_colors.green[800]
  },
  deviceIconAsleep: {
    color: import_colors.lightBlue[500]
  },
  deviceIconDead: {
    color: import_colors.red[900]
  }
}));
var DeviceStatusIcon = (props) => {
  const {status} = props;
  const {translate: _} = (0, import_hooks2.useI18n)();
  const classes = useStyles2();
  const title = _(status ?? "unknown");
  switch (status) {
    case "alive":
    case "awake":
      return /* @__PURE__ */ import_react3.default.createElement(import_Tooltip2.default, {
        title
      }, /* @__PURE__ */ import_react3.default.createElement(import_Wifi.default, {
        className: classes.deviceIconAlive
      }));
    case "asleep":
      return /* @__PURE__ */ import_react3.default.createElement(import_Tooltip2.default, {
        title
      }, /* @__PURE__ */ import_react3.default.createElement(import_PowerSettingsNew.default, {
        className: classes.deviceIconAsleep
      }));
    case "dead":
      return /* @__PURE__ */ import_react3.default.createElement(import_Tooltip2.default, {
        title
      }, /* @__PURE__ */ import_react3.default.createElement(import_WifiOff.default, {
        className: classes.deviceIconDead
      }));
    default:
      return /* @__PURE__ */ import_react3.default.createElement(import_Tooltip2.default, {
        title
      }, /* @__PURE__ */ import_react3.default.createElement(import_DeviceUnknown.default, null));
  }
};

// admin/src/components/Messages.tsx
var import_react4 = __toModule(require_react());
var import_hooks3 = __toModule(require_hooks());
var import_Typography = __toModule(require_Typography());
var Base = (props) => {
  return /* @__PURE__ */ import_react4.default.createElement(import_Typography.default, {
    variant: "body1",
    style: {textAlign: "center"}
  }, props.children);
};
var NotRunning = () => {
  const {translate: _} = (0, import_hooks3.useI18n)();
  return /* @__PURE__ */ import_react4.default.createElement(Base, null, _("adapter not ready"));
};
var NoDevices = () => {
  const {translate: _} = (0, import_hooks3.useI18n)();
  return /* @__PURE__ */ import_react4.default.createElement(Base, null, _("No devices present"));
};
var NodeNotReady = () => {
  const {translate: _} = (0, import_hooks3.useI18n)();
  return /* @__PURE__ */ import_react4.default.createElement(Base, null, _("Node is not ready"));
};

// admin/src/components/AssociationNodeTable.tsx
var import_hooks4 = __toModule(require_hooks());
var import_TableBody = __toModule(require_TableBody());
var import_TableCell2 = __toModule(require_TableCell());
var import_TableHead = __toModule(require_TableHead());
var import_TableRow2 = __toModule(require_TableRow());
var import_Table = __toModule(require_Table());
var import_Paper = __toModule(require_Paper());
var import_styles3 = __toModule(require_styles());
var import_Typography2 = __toModule(require_Typography());
var useStyles3 = (0, import_styles3.makeStyles)((theme) => ({
  headline: {
    backgroundColor: theme.palette.background.default,
    margin: theme.spacing(-2),
    marginBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2)
  },
  table: {
    marginTop: theme.spacing(-2)
  },
  nodeNumber: {
    "& > *": {
      verticalAlign: "middle"
    }
  },
  paper: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(4),
    "&:first-child": {
      margin: 0
    }
  }
}));
function AssociationNodeTableHeadline(props) {
  const {translate: _} = (0, import_hooks4.useI18n)();
  const {value, status} = props.device;
  const nodeId = value.native.id;
  const nodeName = value.common.name && !value.common.name.startsWith("Node") ? value.common.name : void 0;
  const classes = useStyles3();
  return /* @__PURE__ */ import_react5.default.createElement("div", {
    className: classes.headline
  }, /* @__PURE__ */ import_react5.default.createElement(import_Typography2.default, {
    variant: "h5",
    component: "h2",
    className: classes.nodeNumber
  }, /* @__PURE__ */ import_react5.default.createElement("span", null, _("Node"), " ", (0, import_strings2.padStart)(nodeId.toString(), 3, "0")), "\xA0", /* @__PURE__ */ import_react5.default.createElement(DeviceStatusIcon, {
    status
  })), nodeName && /* @__PURE__ */ import_react5.default.createElement(import_Typography2.default, {
    variant: "h6",
    component: "h3"
  }, nodeName));
}
function AssociationNodeTableContent(props) {
  const {translate: _} = (0, import_hooks4.useI18n)();
  const {endpoints, value} = props.device;
  const nodeId = value.native.id;
  const {
    sourceEndpoints,
    groups,
    supportsMultiChannel,
    hasAssociations,
    associations
  } = import_react5.default.useMemo(() => {
    const definitions = [];
    let hasAssociations2 = false;
    let supportsMultiChannel2 = false;
    const groups2 = new Map();
    const sourceEndpoints2 = [];
    if (endpoints) {
      for (const [index, endpoint] of endpoints) {
        if (!endpoint.associationGroups) {
          groups2.set(index, []);
        } else {
          supportsMultiChannel2 ||= Object.values(endpoint.associationGroups).some((a) => !!a.multiChannel);
          groups2.set(index, Object.entries(endpoint.associationGroups).map(([group, def]) => ({
            group: parseInt(group),
            ...def
          })));
        }
        if (endpoint.associations) {
          definitions.push(...Object.entries(endpoint.associations).map(([group, assocs]) => assocs.map((a) => ({
            sourceEndpoint: index,
            group: parseInt(group),
            ...a
          }))).reduce((acc, cur) => [...acc, ...cur], []).sort((a1, a2) => {
            return a1.group - a2.group || a1.nodeId - a2.nodeId || (a1.endpoint ?? -1) - (a2.endpoint ?? -1);
          }));
          hasAssociations2 ||= Object.keys(endpoint.associations).length > 0;
        }
      }
      if (supportsMultiChannel2)
        sourceEndpoints2.push(0);
      sourceEndpoints2.push(...endpoints.keys());
    }
    return {
      sourceEndpoints: sourceEndpoints2,
      groups: groups2,
      supportsMultiChannel: supportsMultiChannel2,
      hasAssociations: hasAssociations2,
      associations: definitions
    };
  }, [endpoints]);
  const classes = useStyles3();
  return /* @__PURE__ */ import_react5.default.createElement(import_Table.default, {
    className: classes.table
  }, /* @__PURE__ */ import_react5.default.createElement(import_TableHead.default, null, /* @__PURE__ */ import_react5.default.createElement(import_TableRow2.default, null, /* @__PURE__ */ import_react5.default.createElement(import_TableCell2.default, null, _("Source endpoint")), /* @__PURE__ */ import_react5.default.createElement(import_TableCell2.default, null, _("Group")), /* @__PURE__ */ import_react5.default.createElement(import_TableCell2.default, null, _("Target node")), supportsMultiChannel && /* @__PURE__ */ import_react5.default.createElement(import_TableCell2.default, null, _("Target endpoint")), /* @__PURE__ */ import_react5.default.createElement(import_TableCell2.default, null, "\xA0"))), /* @__PURE__ */ import_react5.default.createElement(import_TableBody.default, null, hasAssociations ? associations.map((assoc) => /* @__PURE__ */ import_react5.default.createElement(AssociationRow, {
    key: `from${nodeId}${assoc.sourceEndpoint ?? -1}-to${assoc.group}-${assoc.nodeId}-${assoc.endpoint ?? -1}`,
    endpoints: sourceEndpoints ?? [],
    groups,
    nodes: props.nodes.filter((n) => n.nodeId !== nodeId),
    sourceEndpoint: assoc.sourceEndpoint ?? 0,
    group: assoc.group,
    nodeId: assoc.nodeId,
    endpoint: assoc.endpoint,
    supportsMultiChannel,
    save: (sourceEndpoint, group, targetNodeId, endpoint) => {
      return props.saveAssociation(nodeId, assoc, {
        sourceEndpoint,
        group,
        nodeId: targetNodeId,
        endpoint
      });
    },
    delete: () => {
      return props.deleteAssociation(nodeId, assoc);
    }
  })) : /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null), /* @__PURE__ */ import_react5.default.createElement(AssociationRow, {
    endpoints: sourceEndpoints ?? [],
    groups,
    nodes: props.nodes.filter((n) => n.nodeId !== nodeId),
    sourceEndpoint: void 0,
    group: void 0,
    nodeId: void 0,
    supportsMultiChannel,
    save: (sourceEndpoint, group, targetNodeId, endpoint) => {
      return props.saveAssociation(nodeId, void 0, {
        sourceEndpoint,
        group,
        nodeId: targetNodeId,
        endpoint
      });
    }
  })));
}
var AssociationNodeTable = (props) => {
  const {ready, endpoints} = props.device;
  const hasSomeAssociationGroups = !!endpoints && [...endpoints.values()].some((e) => !!e.associationGroups);
  const classes = useStyles3();
  if (ready && !hasSomeAssociationGroups) {
    return /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null);
  }
  return /* @__PURE__ */ import_react5.default.createElement(import_Paper.default, {
    className: classes.paper,
    elevation: 2
  }, /* @__PURE__ */ import_react5.default.createElement(AssociationNodeTableHeadline, {
    device: props.device
  }), ready ? /* @__PURE__ */ import_react5.default.createElement(AssociationNodeTableContent, {
    ...props
  }) : /* @__PURE__ */ import_react5.default.createElement(NodeNotReady, null));
};

// admin/src/pages/Associations.tsx
var import_hooks6 = __toModule(require_hooks());

// admin/src/lib/useDevices.ts
var import_hooks5 = __toModule(require_hooks());
var import_react6 = __toModule(require_react());
var DevicesContext = import_react6.default.createContext({
  devices: {},
  async updateDevices() {
  }
});
var deviceIdRegex = /Node_(\d+)$/;
var deviceReadyRegex = /Node_(\d+)\.ready$/;
var deviceStatusRegex = /Node_(\d+)\.status$/;
function useDevices() {
  const connection = (0, import_hooks5.useConnection)();
  const [devices, setDevices] = import_react6.default.useState({});
  const {namespace} = (0, import_hooks5.useGlobals)();
  const api = useAPI();
  const onObjectChange = async (id, obj) => {
    if (!id.startsWith(namespace) || !deviceIdRegex.test(id))
      return;
    if (obj) {
      if (obj.type === "device" && typeof obj.native.id === "number") {
        const nodeId = obj.native.id;
        const device = {
          id,
          value: obj,
          status: await api.getNodeStatus(nodeId),
          ready: await api.getNodeReady(nodeId)
        };
        if (device.ready) {
          await api.updateEndpointsAndAssociations(nodeId, device);
        }
        setDevices((devices2) => ({...devices2, [nodeId]: device}));
      }
    } else {
      const nodeId = parseInt(deviceIdRegex.exec(id)[1], 10);
      setDevices((devices2) => {
        const newDevices = {...devices2};
        delete newDevices[nodeId];
        return newDevices;
      });
    }
  };
  const updateAssociations = async (nodeId) => {
    const device = {};
    await api.updateEndpointsAndAssociations(nodeId, device);
    setDevices((devices2) => {
      const updatedDevice = devices2[nodeId];
      if (updatedDevice) {
        updatedDevice.endpoints = device.endpoints;
        return {
          ...devices2,
          [nodeId]: updatedDevice
        };
      } else {
        return devices2;
      }
    });
  };
  const onStateChange = async (id, state) => {
    if (!id.startsWith(namespace))
      return;
    if (!state || !state.ack)
      return;
    if (id.match(deviceStatusRegex)) {
      const nodeId = parseInt(deviceStatusRegex.exec(id)[1], 10);
      setDevices((devices2) => {
        const updatedDevice = devices2[nodeId];
        if (updatedDevice) {
          updatedDevice.status = state.val;
          return {
            ...devices2,
            [nodeId]: updatedDevice
          };
        } else {
          return devices2;
        }
      });
    } else if (id.match(deviceReadyRegex)) {
      const nodeId = parseInt(deviceReadyRegex.exec(id)[1], 10);
      setDevices((devices2) => {
        const updatedDevice = devices2[nodeId];
        if (updatedDevice) {
          updatedDevice.ready = state.val;
          if (updatedDevice.ready)
            setTimeout(() => void updateAssociations(nodeId), 0);
          return {
            ...devices2,
            [nodeId]: updatedDevice
          };
        } else {
          return devices2;
        }
      });
    }
  };
  async function updateDevices() {
    setDevices(await api.loadDevices({
      status: true,
      associations: true,
      ready: true
    }));
  }
  import_react6.default.useEffect(() => {
    (async () => {
      await updateDevices();
      connection.subscribeObject(`${namespace}.Node_*`, onObjectChange);
      connection.subscribeState(`${namespace}.Node_*`, onStateChange);
    })();
    return () => {
      connection.unsubscribeObject(`${namespace}.Node_*`, onObjectChange);
      connection.unsubscribeState(`${namespace}.Node_*`, onStateChange);
    };
  }, []);
  return [devices, updateDevices];
}

// admin/src/pages/Associations.tsx
var Associations = () => {
  const [devices, updateDevices] = useDevices();
  const {alive: adapterRunning, connected: driverReady} = (0, import_hooks6.useAdapter)();
  const api = useAPI();
  async function saveAssociation(nodeId, prev, current) {
    if (prev)
      await deleteAssociation(nodeId, prev);
    await api.addAssociation(nodeId, current);
    await updateDevices();
  }
  async function deleteAssociation(nodeId, association) {
    await api.removeAssociation(nodeId, association);
    await updateDevices();
  }
  const devicesAsArray = devices ? Object.values(devices).filter(Boolean) : [];
  const nodes = devicesAsArray.map((d) => ({
    nodeId: d.value.native.id,
    endpointIndizes: d.value.native.endpointIndizes
  }));
  if (!adapterRunning || !driverReady)
    return /* @__PURE__ */ import_react7.default.createElement(NotRunning, null);
  if (!devicesAsArray.length)
    return /* @__PURE__ */ import_react7.default.createElement(NoDevices, null);
  return /* @__PURE__ */ import_react7.default.createElement(import_react7.default.Fragment, null, devicesAsArray.map((device, index) => /* @__PURE__ */ import_react7.default.createElement(AssociationNodeTable, {
    key: index,
    device,
    nodes,
    saveAssociation,
    deleteAssociation
  })));
};

// admin/src/pages/Devices.tsx
var import_react18 = __toModule(require_react());
var import_hooks15 = __toModule(require_hooks());

// admin/src/components/DeviceActionButtons.tsx
var import_Button2 = __toModule(require_Button());
var import_react8 = __toModule(require_react());
var import_Add2 = __toModule(require_Add());
var import_Remove = __toModule(require_Remove());
var import_NetworkCheck = __toModule(require_NetworkCheck());
var import_hooks7 = __toModule(require_hooks());
var import_styles4 = __toModule(require_styles());
var import_clsx = __toModule(require_clsx());
var DeviceActionButtonsState;
(function(DeviceActionButtonsState2) {
  DeviceActionButtonsState2[DeviceActionButtonsState2["Idle"] = 0] = "Idle";
  DeviceActionButtonsState2[DeviceActionButtonsState2["Including"] = 1] = "Including";
  DeviceActionButtonsState2[DeviceActionButtonsState2["Excluding"] = 2] = "Excluding";
  DeviceActionButtonsState2[DeviceActionButtonsState2["Healing"] = 3] = "Healing";
  DeviceActionButtonsState2[DeviceActionButtonsState2["Busy"] = 4] = "Busy";
})(DeviceActionButtonsState || (DeviceActionButtonsState = {}));
var useStyles4 = (0, import_styles4.makeStyles)((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(1)
  },
  redButton: {
    background: theme.palette.error.main,
    "&:hover": {
      background: theme.palette.error.dark
    }
  }
}));
var DeviceActionButtons = (props) => {
  const {translate: _} = (0, import_hooks7.useI18n)();
  const classes = useStyles4();
  return /* @__PURE__ */ import_react8.default.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ import_react8.default.createElement(import_Button2.default, {
    variant: "contained",
    color: props.state === 1 ? "secondary" : "primary",
    startIcon: /* @__PURE__ */ import_react8.default.createElement(import_Add2.default, null),
    disabled: props.state !== 0 && props.state !== 1,
    onClick: props.beginInclusion
  }, props.state !== 1 ? _("Include device") : _("Inclusion active")), /* @__PURE__ */ import_react8.default.createElement(import_Button2.default, {
    variant: "contained",
    color: props.state === 2 ? "secondary" : "primary",
    startIcon: /* @__PURE__ */ import_react8.default.createElement(import_Remove.default, null),
    disabled: props.state !== 0 && props.state !== 2,
    onClick: props.beginExclusion
  }, props.state !== 2 ? _("Exclude device") : _("Exclusion active")), /* @__PURE__ */ import_react8.default.createElement(import_Button2.default, {
    variant: "contained",
    color: "primary",
    className: (0, import_clsx.default)(props.state === 3 && classes.redButton),
    startIcon: /* @__PURE__ */ import_react8.default.createElement(import_NetworkCheck.default, null),
    disabled: props.state !== 0 && props.state !== 3,
    onClick: props.state !== 3 ? props.healNetwork : props.cancelHealing
  }, props.state !== 3 ? _("Heal network") : _("Cancel healing")));
};

// admin/src/components/DeviceTable.tsx
var import_react16 = __toModule(require_react());
var import_hooks13 = __toModule(require_hooks());
var import_styles11 = __toModule(require_styles());
var import_Paper2 = __toModule(require_Paper());
var import_Table2 = __toModule(require_Table());
var import_TableBody2 = __toModule(require_TableBody());
var import_TableCell4 = __toModule(require_TableCell());
var import_TableContainer = __toModule(require_TableContainer());
var import_TableHead2 = __toModule(require_TableHead());
var import_TableRow4 = __toModule(require_TableRow());

// admin/src/components/DeviceTableRow.tsx
var import_react15 = __toModule(require_react());
var import_TableCell3 = __toModule(require_TableCell());
var import_TableRow3 = __toModule(require_TableRow());

// admin/src/components/HealStatusIcon.tsx
var import_react9 = __toModule(require_react());
var import_hooks8 = __toModule(require_hooks());
var import_Done = __toModule(require_Done());
var import_Redo = __toModule(require_Redo());
var import_ErrorOutline = __toModule(require_ErrorOutline());
var import_Autorenew = __toModule(require_Autorenew());
var import_Tooltip3 = __toModule(require_Tooltip());
var import_colors2 = __toModule(require_colors());
var import_styles5 = __toModule(require_styles());
var useStyles5 = (0, import_styles5.makeStyles)((_theme) => ({
  healIconPending: {
    color: import_colors2.blue[500],
    animation: "$rotation 1.5s infinite ease-in-out",
    animationFillMode: "forwards"
  },
  healIconFailed: {
    color: import_colors2.red[500]
  },
  healIconSkipped: {
    color: import_colors2.orange[800]
  },
  healIconDone: {
    color: import_colors2.green[900]
  },
  "@keyframes rotation": {
    "0%": {
      transform: "rotate(0deg)"
    },
    "95%": {
      transform: "rotate(720deg)",
      animationFillMode: "none"
    },
    "95.1%": {
      transform: "rotate(0deg)"
    }
  }
}));
var HealStatusIcon = (props) => {
  const {status} = props;
  const {translate: _} = (0, import_hooks8.useI18n)();
  const classes = useStyles5();
  switch (status) {
    case "done":
      return /* @__PURE__ */ import_react9.default.createElement(import_Tooltip3.default, {
        title: _("done")
      }, /* @__PURE__ */ import_react9.default.createElement(import_Done.default, {
        className: classes.healIconDone
      }));
    case "skipped":
      return /* @__PURE__ */ import_react9.default.createElement(import_Tooltip3.default, {
        title: _("skipped")
      }, /* @__PURE__ */ import_react9.default.createElement(import_Redo.default, {
        className: classes.healIconSkipped
      }));
    case "failed":
      return /* @__PURE__ */ import_react9.default.createElement(import_Tooltip3.default, {
        title: _("failed")
      }, /* @__PURE__ */ import_react9.default.createElement(import_ErrorOutline.default, {
        className: classes.healIconFailed
      }));
    case "pending":
      return /* @__PURE__ */ import_react9.default.createElement(import_Tooltip3.default, {
        title: _("pending")
      }, /* @__PURE__ */ import_react9.default.createElement(import_Autorenew.default, {
        className: classes.healIconPending
      }));
  }
  throw new Error("Unknown heal status");
};

// admin/src/components/DeviceTableRow.tsx
var import_IconButton = __toModule(require_IconButton());
var import_KeyboardArrowDown = __toModule(require_KeyboardArrowDown());
var import_KeyboardArrowUp = __toModule(require_KeyboardArrowUp());
var import_Collapse = __toModule(require_Collapse());
var import_styles10 = __toModule(require_styles());

// admin/src/components/NodeActions.tsx
var import_Button3 = __toModule(require_Button());
var import_styles6 = __toModule(require_styles());
var import_Tooltip4 = __toModule(require_Tooltip());
var import_react11 = __toModule(require_react());
var import_hooks9 = __toModule(require_hooks());
var import_Publish = __toModule(require_Publish());
var import_ButtonGroup2 = __toModule(require_ButtonGroup());
var import_Close = __toModule(require_Close());
var import_RestorePage = __toModule(require_RestorePage());

// admin/src/lib/usePush.ts
var import_react10 = __toModule(require_react());
function usePush(onPush) {
  const api = useAPI();
  import_react10.default.useEffect(() => {
    api.addPushCallback(onPush);
    return () => {
      api.removePushCallback(onPush);
    };
  }, [api, onPush]);
}

// admin/src/components/NodeActions.tsx
var import_LinearProgress = __toModule(require_LinearProgress());
var import_Typography3 = __toModule(require_Typography());
var import_clsx2 = __toModule(require_clsx());
var import_Memory = __toModule(require_Memory());
var import_DeleteOutline = __toModule(require_DeleteOutline());
var useStyles6 = (0, import_styles6.makeStyles)((theme) => ({
  root: {
    padding: theme.spacing(2, 0),
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    alignItems: "center",
    columnGap: theme.spacing(4),
    rowGap: theme.spacing(2)
  },
  firmwareUpdate: {
    gridColumn: "1 / span 2",
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(4)
  },
  firmwareUpdateMessage: {
    gridColumn: "1 / span 2"
  },
  warning: {
    color: theme.palette.warning.main
  },
  redButton: {
    background: theme.palette.error.main,
    "&:hover": {
      background: theme.palette.error.dark
    }
  }
}));
var NodeActions = (props) => {
  const [loadedFile, setLoadedFile] = import_react11.default.useState();
  const [firmwareUpdateActive, setFirmwareUpdateActive] = import_react11.default.useState(false);
  const [firmwareUpdateStatus, setFirmwareUpdateStatus] = import_react11.default.useState();
  const [message, setMessage] = import_react11.default.useState();
  const input = import_react11.default.useRef();
  const api = useAPI();
  const {nodeId, isBusy, setBusy, supportsFirmwareUpdate} = props;
  const {translate: _} = (0, import_hooks9.useI18n)();
  const {showNotification} = (0, import_hooks9.useDialogs)();
  const isNodeFailed = props.status !== "alive" && props.status !== "awake";
  async function removeNode() {
    setBusy(true);
    try {
      await api.removeFailedNode(nodeId);
    } catch (e) {
      alert(e);
    } finally {
      setBusy(false);
    }
  }
  async function refreshInfo() {
    setBusy(true);
    try {
      await api.refreshNodeInfo(nodeId);
    } catch (e) {
      alert(e);
    } finally {
      setBusy(false);
    }
  }
  const loadFirmware = () => {
    input.current?.click();
  };
  const selectFirmware = async (e) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      const data = new Uint8Array(await file.arrayBuffer());
      setLoadedFile({
        name: file.name,
        data
      });
    }
  };
  async function beginFirmwareUpdate() {
    if (supportsFirmwareUpdate && loadedFile?.data) {
      setBusy(true);
      try {
        setFirmwareUpdateActive(true);
        setFirmwareUpdateStatus({
          type: "progress",
          sentFragments: 0,
          totalFragments: 1
        });
        await api.beginFirmwareUpdate(nodeId, loadedFile.name, Array.from(loadedFile.data));
      } catch (e) {
        setFirmwareUpdateActive(false);
        alert(e);
      } finally {
        setBusy(false);
        setMessage(void 0);
      }
    }
  }
  async function abortFirmwareUpdate() {
    setBusy(true);
    try {
      await api.abortFirmwareUpdate(nodeId);
    } catch (e) {
      alert(e);
    } finally {
      setBusy(false);
      setFirmwareUpdateActive(false);
    }
  }
  usePush((payload) => {
    if (payload.type === "firmwareUpdate") {
      const progress = payload.progress;
      setFirmwareUpdateStatus(progress);
      if (progress.type === "done") {
        const success = progress.status >= 253;
        if (!success) {
          showNotification(_("firmware update failed"), "error");
          setMessage(void 0);
        } else {
          let message2 = _("firmware update successful");
          if (success) {
            if (progress.waitTime) {
              message2 += " " + _("firmware update wait time").replace("{0}", progress.waitTime.toString());
            } else {
              message2 += " " + _("firmware update no wait time");
            }
            message2 += " " + _("firmware update wake up");
          }
          setMessage(message2);
        }
        setLoadedFile(void 0);
        setFirmwareUpdateActive(false);
        setTimeout(() => {
          setFirmwareUpdateStatus(void 0);
        }, 1e4);
      } else {
        setFirmwareUpdateActive(true);
      }
    }
  });
  const updateProgressNumeric = firmwareUpdateStatus?.type === "progress" && typeof firmwareUpdateStatus.totalFragments === "number" && typeof firmwareUpdateStatus.sentFragments === "number" ? Math.round(firmwareUpdateStatus.sentFragments / firmwareUpdateStatus.totalFragments * 1e4) / 100 : Number.NaN;
  import_react11.default.useEffect(() => {
    if (firmwareUpdateStatus?.type === "done")
      return;
    if (props.status === "asleep" && firmwareUpdateActive) {
      setMessage(_("wake up device"));
    } else {
      setMessage(void 0);
    }
  }, [props.status, firmwareUpdateActive, firmwareUpdateStatus]);
  const classes = useStyles6();
  return /* @__PURE__ */ import_react11.default.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ import_react11.default.createElement(import_Button3.default, {
    disabled: isBusy,
    variant: "contained",
    color: "primary",
    startIcon: /* @__PURE__ */ import_react11.default.createElement(import_RestorePage.default, null),
    onClick: () => refreshInfo()
  }, _("Refresh node info")), /* @__PURE__ */ import_react11.default.createElement(import_Typography3.default, {
    variant: "body2"
  }, _("Forget all information about all nodes and re-interview them. Battery-powered nodes might need to be woken up manually.")), /* @__PURE__ */ import_react11.default.createElement(import_Tooltip4.default, {
    title: isNodeFailed ? "" : _("This is not a failed node")
  }, /* @__PURE__ */ import_react11.default.createElement("span", null, /* @__PURE__ */ import_react11.default.createElement(import_Button3.default, {
    disabled: !isNodeFailed || isBusy,
    variant: "contained",
    className: classes.redButton,
    onClick: () => removeNode(),
    startIcon: /* @__PURE__ */ import_react11.default.createElement(import_DeleteOutline.default, null)
  }, _("Remove failed node")))), /* @__PURE__ */ import_react11.default.createElement(import_Typography3.default, {
    variant: "body2"
  }, _("Remove this node from the network."), " ", /* @__PURE__ */ import_react11.default.createElement("span", {
    className: classes.warning
  }, _("WARNING: Only do this if you no longer have physical access."))), supportsFirmwareUpdate && /* @__PURE__ */ import_react11.default.createElement(import_react11.default.Fragment, null, /* @__PURE__ */ import_react11.default.createElement("div", {
    className: classes.firmwareUpdate
  }, /* @__PURE__ */ import_react11.default.createElement(import_Button3.default, {
    disabled: firmwareUpdateActive || isBusy,
    variant: "contained",
    color: "primary",
    onClick: () => loadFirmware(),
    style: {flex: "1 0 auto"},
    startIcon: /* @__PURE__ */ import_react11.default.createElement(import_Memory.default, null)
  }, _("Update Firmware")), /* @__PURE__ */ import_react11.default.createElement("input", {
    type: "file",
    hidden: true,
    id: "firmwareFile",
    accept: ".exe,.ex_,.ota,.otz,.hex,.hec,.gbl,.bin",
    ref: (ref) => {
      if (ref)
        input.current = ref;
    },
    onChange: selectFirmware
  }), firmwareUpdateActive ? /* @__PURE__ */ import_react11.default.createElement(import_react11.default.Fragment, null, /* @__PURE__ */ import_react11.default.createElement("div", {
    className: "progress",
    style: {
      margin: "0 1em",
      flex: "1 1 100%"
    }
  }, Number.isNaN(updateProgressNumeric) ? /* @__PURE__ */ import_react11.default.createElement(import_LinearProgress.default, null) : /* @__PURE__ */ import_react11.default.createElement(import_LinearProgress.default, {
    variant: "determinate",
    value: updateProgressNumeric
  })), !Number.isNaN(updateProgressNumeric) && /* @__PURE__ */ import_react11.default.createElement("div", {
    style: {
      whiteSpace: "nowrap",
      marginRight: "1em"
    }
  }, updateProgressNumeric.toLocaleString(void 0, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }), " %")) : /* @__PURE__ */ import_react11.default.createElement("span", {
    style: {
      flex: "1 1 100%",
      textAlign: "center",
      padding: "0 1em",
      wordBreak: "break-all"
    }
  }, loadedFile ? `${loadedFile.name} (${loadedFile.data.byteLength} bytes)` : _("no file selected")), /* @__PURE__ */ import_react11.default.createElement(import_ButtonGroup2.default, {
    variant: "contained",
    color: "primary",
    style: {flex: "1 0 auto"}
  }, /* @__PURE__ */ import_react11.default.createElement(import_Tooltip4.default, {
    title: _("start firmware update")
  }, /* @__PURE__ */ import_react11.default.createElement(import_Button3.default, {
    disabled: firmwareUpdateActive || isBusy || !loadedFile?.data,
    onClick: () => beginFirmwareUpdate()
  }, /* @__PURE__ */ import_react11.default.createElement(import_Publish.default, null))), /* @__PURE__ */ import_react11.default.createElement(import_Tooltip4.default, {
    title: _("abort firmware update")
  }, /* @__PURE__ */ import_react11.default.createElement(import_Button3.default, {
    disabled: !firmwareUpdateActive || isBusy,
    onClick: () => abortFirmwareUpdate()
  }, /* @__PURE__ */ import_react11.default.createElement(import_Close.default, null))))), message ? /* @__PURE__ */ import_react11.default.createElement("div", {
    className: classes.firmwareUpdateMessage
  }, message) : /* @__PURE__ */ import_react11.default.createElement("div", {
    className: (0, import_clsx2.default)(classes.firmwareUpdateMessage, classes.warning)
  }, _("firmware update warning"))));
};

// admin/src/components/DeviceTableRow.tsx
var import_hooks12 = __toModule(require_hooks());

// admin/src/components/DeviceSecurityIcon.tsx
var import_react12 = __toModule(require_react());
var import_Tooltip5 = __toModule(require_Tooltip());
var import_colors3 = __toModule(require_colors());
var import_styles7 = __toModule(require_styles());
var import_Lock = __toModule(require_Lock());
var import_NoEncryption = __toModule(require_NoEncryption());
var import_clsx3 = __toModule(require_clsx());
var useStyles7 = (0, import_styles7.makeStyles)((_theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 16px)",
    gridTemplateRows: "16px"
  },
  securityIcon: {
    fontSize: "16px",
    color: import_colors3.grey[200]
  },
  S2_AccessControl: {
    color: import_colors3.green[800]
  },
  S2_Authenticated: {
    color: import_colors3.blue[900]
  },
  S2_Unauthenticated: {
    color: import_colors3.deepPurple[500]
  },
  S0_Legacy: {
    color: import_colors3.amber[800]
  }
}));
var SecurityClassIcon = (props) => {
  const classes = useStyles7();
  const Icon = props.granted ? import_Lock.default : import_NoEncryption.default;
  return props.supported ? /* @__PURE__ */ import_react12.default.createElement(import_Tooltip5.default, {
    title: `${props.title}: ${props.granted ? "\u2714" : "\u2718"}`
  }, /* @__PURE__ */ import_react12.default.createElement(Icon, {
    className: (0, import_clsx3.default)(classes.securityIcon, props.granted && classes[props.className])
  })) : /* @__PURE__ */ import_react12.default.createElement("span", null);
};
var secClassDefinitions = [
  ["S2_AccessControl", "S2 Access Control"],
  ["S2_Authenticated", "S2 Authenticated"],
  ["S2_Unauthenticated", "S2 Unauthenticated"],
  ["S0_Legacy", "S0 Legacy"]
];
var DeviceSecurityIcon = (props) => {
  const classes = useStyles7();
  const {securityClasses} = props;
  return /* @__PURE__ */ import_react12.default.createElement("div", {
    className: classes.root
  }, secClassDefinitions.map(([className, title]) => /* @__PURE__ */ import_react12.default.createElement(SecurityClassIcon, {
    key: className,
    title,
    className,
    supported: className in securityClasses,
    granted: securityClasses[className] === true
  })));
};

// admin/src/components/DeviceTableRow.tsx
var import_Home = __toModule(require_Home());
var import_Tooltip6 = __toModule(require_Tooltip());

// admin/src/components/ControllerActions.tsx
var import_Button5 = __toModule(require_Button());
var import_styles9 = __toModule(require_styles());
var import_react14 = __toModule(require_react());
var import_hooks11 = __toModule(require_hooks());
var import_core = __toModule(require_core());
var import_DeleteForever2 = __toModule(require_DeleteForever());
var import_RestorePage2 = __toModule(require_RestorePage());
var import_PowerSettingsNew2 = __toModule(require_PowerSettingsNew());
var import_Language = __toModule(require_Language());

// admin/src/components/SetRFRegionDialog.tsx
var import_react13 = __toModule(require_react());
var import_hooks10 = __toModule(require_hooks());
var import_DialogContent = __toModule(require_DialogContent());
var import_DialogTitle = __toModule(require_DialogTitle());
var import_Dialog = __toModule(require_Dialog());
var import_DialogActions = __toModule(require_DialogActions());
var import_Button4 = __toModule(require_Button());
var import_components2 = __toModule(require_components());
var import_Typography4 = __toModule(require_Typography());
var import_styles8 = __toModule(require_styles());
var useStyles8 = (0, import_styles8.makeStyles)((theme) => ({
  root: {
    display: "flex",
    flexFlow: "column",
    maxWidth: 400,
    gap: theme.spacing(2)
  }
}));
var SetRFRegionDialog = (props) => {
  const {translate: _} = (0, import_hooks10.useI18n)();
  const classes = useStyles8();
  const [region, setRegion] = import_react13.default.useState(props.region);
  const options = import_react13.default.useMemo(() => {
    return Object.entries(props.regions).map(([key, value]) => ({
      value: key,
      label: value
    }));
  }, [props.regions]);
  return /* @__PURE__ */ import_react13.default.createElement(import_Dialog.default, {
    open: props.open,
    onClose: props.onCancel,
    maxWidth: false
  }, /* @__PURE__ */ import_react13.default.createElement(import_DialogTitle.default, {
    id: "alert-dialog-title"
  }, _("Set RF Region")), /* @__PURE__ */ import_react13.default.createElement(import_DialogContent.default, {
    className: classes.root
  }, /* @__PURE__ */ import_react13.default.createElement(import_Typography4.default, {
    variant: "body1"
  }, _("Select the correct region for where you are. Using a different region may be illegal.")), /* @__PURE__ */ import_react13.default.createElement(import_components2.Dropdown, {
    selectedOption: region,
    options,
    onChange: (event) => setRegion(parseInt(event.target.value))
  }), /* @__PURE__ */ import_react13.default.createElement(import_Typography4.default, {
    variant: "body2"
  }, _("Note: Applying a different region might take a few seconds."))), /* @__PURE__ */ import_react13.default.createElement(import_DialogActions.default, null, /* @__PURE__ */ import_react13.default.createElement(import_Button4.default, {
    disabled: props.region === region,
    onClick: () => props.onConfirm(region),
    color: "primary"
  }, _("OK")), /* @__PURE__ */ import_react13.default.createElement(import_Button4.default, {
    onClick: props.onCancel,
    color: "primary"
  }, _("Cancel"))));
};

// admin/src/components/ControllerActions.tsx
var useStyles9 = (0, import_styles9.makeStyles)((theme) => ({
  root: {
    padding: theme.spacing(2, 0),
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    alignItems: "center",
    columnGap: theme.spacing(4),
    rowGap: theme.spacing(2)
  },
  redButton: {
    background: theme.palette.error.main,
    "&:hover": {
      background: theme.palette.error.dark
    }
  }
}));
var ControllerActions = (props) => {
  const {isBusy, setBusy} = props;
  const {namespace} = (0, import_hooks11.useGlobals)();
  const api = useAPI();
  const {translate: _} = (0, import_hooks11.useI18n)();
  const {showModal, showNotification} = (0, import_hooks11.useDialogs)();
  const [showSetRFRegionDialog, setShowSetRFRegionDialog] = import_react14.default.useState(false);
  const [rfRegionObject] = (0, import_hooks11.useIoBrokerObject)(`${namespace}.info.rfRegion`, {
    subscribe: false
  });
  const [rfRegion] = (0, import_hooks11.useIoBrokerState)({
    id: `${namespace}.info.rfRegion`
  });
  const setRFRegion = import_react14.default.useCallback((region) => {
    if (isBusy)
      return;
    setBusy(true);
    api.setRFRegion(region).finally(() => setBusy(false));
  }, [api, isBusy, setBusy]);
  const softReset = import_react14.default.useCallback(() => {
    if (isBusy)
      return;
    setBusy(true);
    api.softReset().finally(() => setBusy(false));
  }, [api, isBusy, setBusy]);
  const clearCache = import_react14.default.useCallback(async () => {
    if (isBusy)
      return;
    try {
      const result = await showModal(_("Re-interview all?"), _("clear cache procedure"));
      if (!result)
        return;
      setBusy(true);
      await api.clearCache();
      setTimeout(() => {
        setBusy(false);
      }, 1e3);
    } catch (e) {
      showNotification(getErrorMessage(e), "error");
      return;
    }
  }, [api, isBusy, showModal, showNotification]);
  const hardReset = import_react14.default.useCallback(async () => {
    if (isBusy)
      return;
    try {
      const result = await showModal(_("Factory reset?"), _("factory reset procedure"));
      if (!result)
        return;
      setBusy(true);
      await api.hardReset();
      setBusy(false);
      await showModal(_("Factory reset successful"), _("The adapter will now restart."));
    } catch (e) {
      showNotification(getErrorMessage(e), "error");
      return;
    }
  }, [api, isBusy, showModal, showNotification]);
  const classes = useStyles9();
  return /* @__PURE__ */ import_react14.default.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ import_react14.default.createElement(import_Button5.default, {
    disabled: isBusy,
    variant: "contained",
    color: "primary",
    onClick: softReset,
    startIcon: /* @__PURE__ */ import_react14.default.createElement(import_PowerSettingsNew2.default, null)
  }, _("Soft reset")), /* @__PURE__ */ import_react14.default.createElement(import_core.Typography, {
    variant: "body2"
  }, _("Restart the controller, e.g. when it hangs")), /* @__PURE__ */ import_react14.default.createElement(import_Button5.default, {
    disabled: isBusy,
    variant: "contained",
    color: "primary",
    onClick: clearCache,
    startIcon: /* @__PURE__ */ import_react14.default.createElement(import_RestorePage2.default, null)
  }, _("Re-interview all")), /* @__PURE__ */ import_react14.default.createElement(import_core.Typography, {
    variant: "body2"
  }, _("Forget all information about all nodes and re-interview them. Battery-powered nodes might need to be woken up manually.")), /* @__PURE__ */ import_react14.default.createElement(import_Button5.default, {
    disabled: isBusy || rfRegion == void 0,
    variant: "contained",
    color: "primary",
    onClick: () => setShowSetRFRegionDialog(true),
    startIcon: /* @__PURE__ */ import_react14.default.createElement(import_Language.default, null)
  }, _("Set RF Region")), /* @__PURE__ */ import_react14.default.createElement(import_core.Typography, {
    variant: "body2"
  }, _("Configure the region and radio frequencies of the controller.")), /* @__PURE__ */ import_react14.default.createElement(import_Button5.default, {
    className: classes.redButton,
    disabled: isBusy,
    variant: "contained",
    onClick: hardReset,
    startIcon: /* @__PURE__ */ import_react14.default.createElement(import_DeleteForever2.default, null)
  }, _("Factory reset")), /* @__PURE__ */ import_react14.default.createElement(import_core.Typography, {
    variant: "body2"
  }, _("Wipes all configuration of the controller. All connected nodes will be orphaned and have to be reset and included into the new network before they can be used again.")), rfRegionObject && rfRegion != void 0 && /* @__PURE__ */ import_react14.default.createElement(SetRFRegionDialog, {
    open: showSetRFRegionDialog,
    onCancel: () => setShowSetRFRegionDialog(false),
    onConfirm: (region) => {
      setRFRegion(region);
      setShowSetRFRegionDialog(false);
    },
    region: rfRegion,
    regions: rfRegionObject.common.states ?? {}
  }));
};

// admin/src/components/DeviceTableRow.tsx
var useStyles10 = (0, import_styles10.makeStyles)((theme) => ({
  mainRow: {
    "& > *": {
      border: 0
    }
  },
  controllerIcon: {
    fontSize: "16px",
    margin: "7px",
    color: theme.palette.text.secondary
  },
  idCell: {
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "center"
  },
  expanderCell: {
    paddingBottom: 0,
    paddingTop: 0,
    background: theme.palette.background.default
  }
}));
var DeviceTableRow = (props) => {
  const {healStatus, device} = props;
  const {value, status} = device;
  const nodeId = value.native.id;
  const supportsFirmwareUpdate = !!value.native.supportsFirmwareUpdate;
  const {secure, securityClasses, isControllerNode} = value.native;
  const [open, setOpen] = import_react15.default.useState(isControllerNode);
  const classes = useStyles10();
  const {translate: _} = (0, import_hooks12.useI18n)();
  return /* @__PURE__ */ import_react15.default.createElement(import_react15.default.Fragment, null, /* @__PURE__ */ import_react15.default.createElement(import_TableRow3.default, {
    hover: true,
    className: classes.mainRow
  }, /* @__PURE__ */ import_react15.default.createElement(import_TableCell3.default, {
    className: classes.idCell
  }, /* @__PURE__ */ import_react15.default.createElement(import_IconButton.default, {
    "aria-label": "expand row",
    size: "small",
    onClick: () => setOpen(!open)
  }, open ? /* @__PURE__ */ import_react15.default.createElement(import_KeyboardArrowUp.default, null) : /* @__PURE__ */ import_react15.default.createElement(import_KeyboardArrowDown.default, null)), /* @__PURE__ */ import_react15.default.createElement("span", {
    style: {marginLeft: "auto"}
  }, nodeId)), /* @__PURE__ */ import_react15.default.createElement(import_TableCell3.default, null, value.common.name), /* @__PURE__ */ import_react15.default.createElement(import_TableCell3.default, null, value.native.type.specific ?? value.native.type.generic ?? _("unknown")), /* @__PURE__ */ import_react15.default.createElement(import_TableCell3.default, null, secure && securityClasses && /* @__PURE__ */ import_react15.default.createElement(DeviceSecurityIcon, {
    securityClasses
  })), /* @__PURE__ */ import_react15.default.createElement(import_TableCell3.default, null, isControllerNode ? /* @__PURE__ */ import_react15.default.createElement(import_Tooltip6.default, {
    title: _("Controller node")
  }, /* @__PURE__ */ import_react15.default.createElement(import_Home.default, null)) : /* @__PURE__ */ import_react15.default.createElement(import_react15.default.Fragment, null, /* @__PURE__ */ import_react15.default.createElement(DeviceStatusIcon, {
    status
  }), !!healStatus && /* @__PURE__ */ import_react15.default.createElement(import_react15.default.Fragment, null, " ", /* @__PURE__ */ import_react15.default.createElement(HealStatusIcon, {
    status: props.healStatus
  }))))), /* @__PURE__ */ import_react15.default.createElement(import_TableRow3.default, null, /* @__PURE__ */ import_react15.default.createElement(import_TableCell3.default, {
    colSpan: 5,
    className: classes.expanderCell
  }, /* @__PURE__ */ import_react15.default.createElement(import_Collapse.default, {
    in: open,
    timeout: "auto",
    unmountOnExit: true
  }, isControllerNode ? /* @__PURE__ */ import_react15.default.createElement(ControllerActions, {
    isBusy: props.isBusy,
    setBusy: props.setBusy
  }) : /* @__PURE__ */ import_react15.default.createElement(NodeActions, {
    nodeId,
    status,
    isBusy: props.isBusy,
    setBusy: props.setBusy,
    supportsFirmwareUpdate
  })))));
};

// admin/src/components/DeviceTable.tsx
var useStyles11 = (0, import_styles11.makeStyles)((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(2)
  },
  container: {
    overflowY: "auto"
  },
  empty: {
    textAlign: "center",
    fontStyle: "italic"
  }
}));
var DeviceTable = (props) => {
  const {translate: _} = (0, import_hooks13.useI18n)();
  const classes = useStyles11();
  const {devices, healingNetwork, networkHealProgress} = props;
  return /* @__PURE__ */ import_react16.default.createElement(import_Paper2.default, {
    className: classes.root,
    elevation: 2
  }, /* @__PURE__ */ import_react16.default.createElement(import_TableContainer.default, {
    className: classes.container
  }, /* @__PURE__ */ import_react16.default.createElement(import_Table2.default, null, /* @__PURE__ */ import_react16.default.createElement(import_TableHead2.default, null, /* @__PURE__ */ import_react16.default.createElement(import_TableRow4.default, null, /* @__PURE__ */ import_react16.default.createElement(import_TableCell4.default, {
    align: "right"
  }, "#"), /* @__PURE__ */ import_react16.default.createElement(import_TableCell4.default, null, _("Name")), /* @__PURE__ */ import_react16.default.createElement(import_TableCell4.default, null, _("Type")), /* @__PURE__ */ import_react16.default.createElement(import_TableCell4.default, null, _("Security")), /* @__PURE__ */ import_react16.default.createElement(import_TableCell4.default, null, _("Status")))), /* @__PURE__ */ import_react16.default.createElement(import_TableBody2.default, null, devices.length ? devices.map((device) => {
    const nodeId = device.value.native.id;
    return /* @__PURE__ */ import_react16.default.createElement(DeviceTableRow, {
      key: `device-${nodeId}`,
      isBusy: props.isBusy,
      setBusy: props.setBusy,
      device,
      healStatus: healingNetwork ? networkHealProgress[nodeId] : void 0
    });
  }) : /* @__PURE__ */ import_react16.default.createElement(import_TableRow4.default, null, /* @__PURE__ */ import_react16.default.createElement(import_TableCell4.default, {
    colSpan: 5,
    className: classes.empty
  }, _("No devices present")))))));
};

// admin/src/components/InclusionExclusionDialog.tsx
var import_Button6 = __toModule(require_Button());
var import_Dialog2 = __toModule(require_Dialog());
var import_DialogActions2 = __toModule(require_DialogActions());
var import_DialogContent2 = __toModule(require_DialogContent());
var import_DialogTitle2 = __toModule(require_DialogTitle());
var import_CircularProgress = __toModule(require_CircularProgress());
var import_styles12 = __toModule(require_styles());
var import_Typography5 = __toModule(require_Typography());
var import_hooks14 = __toModule(require_hooks());
var import_react17 = __toModule(require_react());
var import_CheckCircle = __toModule(require_CheckCircle());
var import_Warning = __toModule(require_Warning());
var import_colors4 = __toModule(require_colors());
var import_clsx4 = __toModule(require_clsx());
var import_TextField = __toModule(require_TextField());
var import_FormControlLabel = __toModule(require_FormControlLabel());
var import_Checkbox = __toModule(require_Checkbox());
var useStyles12 = (0, import_styles12.makeStyles)((theme) => ({
  strategyRoot: {},
  strategyGridHeadline: {
    marginTop: theme.spacing(4)
  },
  strategyGrid: {
    marginTop: theme.spacing(1),
    display: "grid",
    gridTemplateColumns: "auto 400px",
    gridGap: theme.spacing(2),
    alignItems: "center"
  },
  strategyList: {
    ...theme.typography.body2
  },
  waitMessageRoot: {
    display: "grid",
    gridTemplateColumns: "minmax(auto, 10ch) 1fr",
    gridGap: theme.spacing(4),
    alignItems: "center",
    overflow: "hidden"
  },
  grantRoot: {
    display: "flex",
    flexFlow: "column nowrap",
    gap: theme.spacing(1),
    maxWidth: "600px"
  },
  grantHeadline: {
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(1)
  },
  grantCSA: {
    marginTop: theme.spacing(2)
  },
  validateDSKRoot: {
    maxWidth: "600px"
  },
  validateDSKGrid: {
    marginTop: theme.spacing(1),
    display: "grid",
    width: "100%",
    gridTemplateColumns: "minmax(auto, 10ch) 1fr",
    gridGap: theme.spacing(1),
    alignItems: "center",
    textAlign: "center"
  },
  resultRoot: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gridTemplateRows: "auto auto auto",
    alignItems: "center"
  },
  resultIcon: {
    marginRight: theme.spacing(4),
    fontSize: "64px",
    gridRow: "1 / span 3",
    gridColumn: 1
  },
  resultIconOK: {
    color: import_colors4.green[500]
  },
  resultIconLowSecurity: {
    color: import_colors4.yellow[700]
  }
}));
var InclusionExclusionStep;
(function(InclusionExclusionStep2) {
  InclusionExclusionStep2[InclusionExclusionStep2["SelectInclusionStrategy"] = 0] = "SelectInclusionStrategy";
  InclusionExclusionStep2[InclusionExclusionStep2["SelectReplacementStrategy"] = 1] = "SelectReplacementStrategy";
  InclusionExclusionStep2[InclusionExclusionStep2["IncludeDevice"] = 2] = "IncludeDevice";
  InclusionExclusionStep2[InclusionExclusionStep2["ExcludeDevice"] = 3] = "ExcludeDevice";
  InclusionExclusionStep2[InclusionExclusionStep2["GrantSecurityClasses"] = 4] = "GrantSecurityClasses";
  InclusionExclusionStep2[InclusionExclusionStep2["ValidateDSK"] = 5] = "ValidateDSK";
  InclusionExclusionStep2[InclusionExclusionStep2["Busy"] = 6] = "Busy";
  InclusionExclusionStep2[InclusionExclusionStep2["Result"] = 7] = "Result";
  InclusionExclusionStep2[InclusionExclusionStep2["ExclusionResult"] = 8] = "ExclusionResult";
})(InclusionExclusionStep || (InclusionExclusionStep = {}));
var InclusionStrategy;
(function(InclusionStrategy2) {
  InclusionStrategy2[InclusionStrategy2["Default"] = 0] = "Default";
  InclusionStrategy2[InclusionStrategy2["SmartStart"] = 1] = "SmartStart";
  InclusionStrategy2[InclusionStrategy2["Insecure"] = 2] = "Insecure";
  InclusionStrategy2[InclusionStrategy2["Security_S0"] = 3] = "Security_S0";
  InclusionStrategy2[InclusionStrategy2["Security_S2"] = 4] = "Security_S2";
})(InclusionStrategy || (InclusionStrategy = {}));
var SelectInclusionStrategyStep = (props) => {
  const {translate: _} = (0, import_hooks14.useI18n)();
  const classes = useStyles12();
  const [forceSecurity, setForceSecurity] = import_react17.default.useState(false);
  const strategyCaptionDefault = forceSecurity ? _("Security S2 when supported, Security S0 as a fallback, no encryption otherwise.") : _("Security S2 when supported, Security S0 only when necessary, no encryption otherwise.");
  return /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, /* @__PURE__ */ import_react17.default.createElement(import_DialogContent2.default, {
    className: classes.strategyRoot
  }, /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "body2"
  }, _("Z-Wave supports the following security mechanisms:")), /* @__PURE__ */ import_react17.default.createElement("ul", {
    className: classes.strategyList,
    style: {marginTop: "0.5em"}
  }, /* @__PURE__ */ import_react17.default.createElement("li", null, /* @__PURE__ */ import_react17.default.createElement("b", null, "Security S2"), " \u2013 ", _("fast and secure"), " ", /* @__PURE__ */ import_react17.default.createElement("b", null, _("(recommended)"))), /* @__PURE__ */ import_react17.default.createElement("li", null, /* @__PURE__ */ import_react17.default.createElement("b", null, "Security S0"), " \u2013", " ", _("secure, but slow due to a lot of overhead"), " ", /* @__PURE__ */ import_react17.default.createElement("b", null, _("(use only when necessary)"))), /* @__PURE__ */ import_react17.default.createElement("li", null, _("No encryption"))), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "body1",
    className: classes.strategyGridHeadline
  }, _("Please choose an inclusion strategy"), ":"), /* @__PURE__ */ import_react17.default.createElement("div", {
    className: classes.strategyGrid
  }, /* @__PURE__ */ import_react17.default.createElement("div", {
    style: {
      gridRow: 1,
      display: "flex",
      flexFlow: "column"
    }
  }, /* @__PURE__ */ import_react17.default.createElement(import_Button6.default, {
    variant: "contained",
    color: "primary",
    onClick: () => props.selectStrategy(0, forceSecurity)
  }, _("Default (secure)")), /* @__PURE__ */ import_react17.default.createElement(import_FormControlLabel.default, {
    label: _("Prefer S0 over no encryption"),
    control: /* @__PURE__ */ import_react17.default.createElement(import_Checkbox.default, {
      checked: forceSecurity,
      onChange: (event, checked) => setForceSecurity(checked)
    })
  })), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "caption",
    style: {alignSelf: "flex-start"}
  }, strategyCaptionDefault, /* @__PURE__ */ import_react17.default.createElement("br", null), _("Requires user interaction during the inclusion.")), /* @__PURE__ */ import_react17.default.createElement(import_Button6.default, {
    variant: "contained",
    color: "secondary",
    style: {gridRow: 2},
    disabled: true,
    onClick: () => props.selectStrategy(1)
  }, "SmartStart"), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "caption"
  }, "coming soon..."), /* @__PURE__ */ import_react17.default.createElement(import_Button6.default, {
    variant: "contained",
    color: "default",
    style: {gridRow: 3},
    onClick: () => props.selectStrategy(2)
  }, _("No encryption")))), /* @__PURE__ */ import_react17.default.createElement(import_DialogActions2.default, null, /* @__PURE__ */ import_react17.default.createElement(import_Button6.default, {
    variant: "contained",
    onClick: props.onCancel,
    color: "primary"
  }, _("Cancel"))));
};
var SelectReplacementStrategyStep = (props) => {
  const {translate: _} = (0, import_hooks14.useI18n)();
  const classes = useStyles12();
  return /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, /* @__PURE__ */ import_react17.default.createElement(import_DialogContent2.default, {
    className: classes.strategyRoot
  }, /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "body1",
    className: classes.strategyGridHeadline
  }, _("Please choose a replacement strategy"), ":"), /* @__PURE__ */ import_react17.default.createElement("div", {
    className: classes.strategyGrid
  }, /* @__PURE__ */ import_react17.default.createElement(import_Button6.default, {
    variant: "contained",
    color: "primary",
    style: {gridRow: 1},
    onClick: () => props.selectStrategy(4)
  }, _("Security S2")), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "caption",
    style: {alignSelf: "flex-start"}
  }, _("fast and secure"), /* @__PURE__ */ import_react17.default.createElement("br", null), _("(recommended)")), /* @__PURE__ */ import_react17.default.createElement(import_Button6.default, {
    variant: "contained",
    color: "secondary",
    style: {gridRow: 2},
    disabled: true,
    onClick: () => props.selectStrategy(3)
  }, _("Security S0")), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "caption"
  }, _("secure, but slow due to a lot of overhead"), /* @__PURE__ */ import_react17.default.createElement("br", null), _("(use only when necessary)")), /* @__PURE__ */ import_react17.default.createElement(import_Button6.default, {
    variant: "contained",
    color: "default",
    style: {gridRow: 3},
    onClick: () => props.selectStrategy(2)
  }, _("No encryption")))), /* @__PURE__ */ import_react17.default.createElement(import_DialogActions2.default, null, /* @__PURE__ */ import_react17.default.createElement(import_Button6.default, {
    variant: "contained",
    onClick: props.onCancel,
    color: "primary"
  }, _("Cancel"))));
};
var WaitMessageStep = (props) => {
  const classes = useStyles12();
  const {translate: _} = (0, import_hooks14.useI18n)();
  return /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, /* @__PURE__ */ import_react17.default.createElement(import_DialogContent2.default, {
    className: classes.waitMessageRoot
  }, /* @__PURE__ */ import_react17.default.createElement(import_CircularProgress.default, {
    size: 48
  }), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "body1"
  }, props.message)), /* @__PURE__ */ import_react17.default.createElement(import_DialogActions2.default, null, props.onCancel && /* @__PURE__ */ import_react17.default.createElement(import_Button6.default, {
    variant: "contained",
    onClick: props.onCancel,
    color: "primary"
  }, _("Cancel"))));
};
var GrantSecurityClassesStep = (props) => {
  const {translate: _} = (0, import_hooks14.useI18n)();
  const classes = useStyles12();
  const request = props.request;
  const requestS2AccessControl = request.securityClasses.includes(2);
  const requestS2Authenticated = request.securityClasses.includes(1);
  const requestS2Unauthenticated = request.securityClasses.includes(0);
  const requestS0Legacy = request.securityClasses.includes(7);
  const requestCSA = request.clientSideAuth;
  const [grantS2AccessControl, setGrantS2AccessControl] = import_react17.default.useState(requestS2AccessControl);
  const [grantS2Authenticated, setGrantS2Authenticated] = import_react17.default.useState(requestS2Authenticated);
  const [grantS2Unauthenticated, setGrantS2Unauthenticated] = import_react17.default.useState(requestS2Unauthenticated);
  const [grantS0Legacy, setGrantS0Legacy] = import_react17.default.useState(requestS0Legacy);
  const [grantCSA, setGrantCSA] = import_react17.default.useState(requestCSA);
  const handleOk = () => {
    const securityClasses = [];
    if (grantS2AccessControl)
      securityClasses.push(2);
    if (grantS2Authenticated)
      securityClasses.push(1);
    if (grantS2Unauthenticated)
      securityClasses.push(0);
    if (grantS0Legacy)
      securityClasses.push(7);
    const grant = {
      securityClasses,
      clientSideAuth: grantCSA
    };
    props.grantSecurityClasses(grant);
  };
  return /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, /* @__PURE__ */ import_react17.default.createElement(import_DialogContent2.default, {
    className: classes.grantRoot
  }, /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "body1"
  }, _("Please choose which of the following security classes to grant to the new node.")), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "caption",
    className: classes.grantHeadline
  }, _("At least one must be granted or the key exchange will be canceled.")), /* @__PURE__ */ import_react17.default.createElement(import_FormControlLabel.default, {
    label: /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, /* @__PURE__ */ import_react17.default.createElement("b", null, "S2 Access Control", !requestS2AccessControl && /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, " (", _("not requested"), ")")), /* @__PURE__ */ import_react17.default.createElement("br", null), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
      variant: "caption"
    }, _("Example:"), " ", _("Door locks, garage doors"), ", ...")),
    disabled: !requestS2AccessControl,
    control: /* @__PURE__ */ import_react17.default.createElement(import_Checkbox.default, {
      checked: grantS2AccessControl,
      onChange: (event, checked) => setGrantS2AccessControl(checked)
    })
  }), /* @__PURE__ */ import_react17.default.createElement(import_FormControlLabel.default, {
    label: /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, /* @__PURE__ */ import_react17.default.createElement("b", null, "S2 Authenticated", !requestS2Authenticated && /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, " (", _("not requested"), ")")), /* @__PURE__ */ import_react17.default.createElement("br", null), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
      variant: "caption"
    }, _("Example:"), " ", _("Lighting, sensors, security systems"), ", ...")),
    disabled: !requestS2Authenticated,
    control: /* @__PURE__ */ import_react17.default.createElement(import_Checkbox.default, {
      checked: grantS2Authenticated,
      onChange: (event, checked) => setGrantS2Authenticated(checked)
    })
  }), /* @__PURE__ */ import_react17.default.createElement(import_FormControlLabel.default, {
    label: /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, /* @__PURE__ */ import_react17.default.createElement("b", null, "S2 Unauthenticated", !requestS2Unauthenticated && /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, " (", _("not requested"), ")")), /* @__PURE__ */ import_react17.default.createElement("br", null), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
      variant: "caption"
    }, _("Like S2 Authenticated, but without verification that the correct device is included"))),
    disabled: !requestS2Unauthenticated,
    control: /* @__PURE__ */ import_react17.default.createElement(import_Checkbox.default, {
      checked: grantS2Unauthenticated,
      onChange: (event, checked) => setGrantS2Unauthenticated(checked)
    })
  }), /* @__PURE__ */ import_react17.default.createElement(import_FormControlLabel.default, {
    label: /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, /* @__PURE__ */ import_react17.default.createElement("b", null, "S0 Legacy", !requestS0Legacy && /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, " (", _("not requested"), ")")), /* @__PURE__ */ import_react17.default.createElement("br", null), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
      variant: "caption"
    }, _("Example:"), " ", _("Legacy door locks without S2 support"))),
    disabled: !requestS0Legacy,
    control: /* @__PURE__ */ import_react17.default.createElement(import_Checkbox.default, {
      checked: grantS0Legacy,
      onChange: (event, checked) => setGrantS0Legacy(checked)
    })
  }), /* @__PURE__ */ import_react17.default.createElement(import_FormControlLabel.default, {
    className: classes.grantCSA,
    label: /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, /* @__PURE__ */ import_react17.default.createElement("b", null, "Client Side Authentication", !requestCSA && /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, " (", _("not requested"), ")")), /* @__PURE__ */ import_react17.default.createElement("br", null), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
      variant: "caption"
    }, _("For devices without a DSK. Authentication of the inclusion happens on the device instead of in ioBroker."))),
    disabled: !requestCSA,
    control: /* @__PURE__ */ import_react17.default.createElement(import_Checkbox.default, {
      checked: grantCSA,
      onChange: (event, checked) => setGrantCSA(checked)
    })
  })), /* @__PURE__ */ import_react17.default.createElement(import_DialogActions2.default, null, /* @__PURE__ */ import_react17.default.createElement(import_Button6.default, {
    variant: "contained",
    onClick: handleOk,
    color: "primary"
  }, _("OK")), /* @__PURE__ */ import_react17.default.createElement(import_Button6.default, {
    variant: "contained",
    onClick: props.onCancel,
    color: "primary"
  }, _("Cancel"))));
};
var ValidateDSKStep = (props) => {
  const {translate: _} = (0, import_hooks14.useI18n)();
  const [pin, setPIN] = import_react17.default.useState("");
  const [error, setError] = import_react17.default.useState(false);
  const handleChange = (event) => {
    const pin2 = event.target.value.replace(/[^0-9]/g, "");
    setPIN(pin2);
    setError(false);
  };
  const handleBlur = () => {
    if (pin.length !== 5)
      setError(true);
  };
  const handleOk = () => {
    if (pin.length === 5)
      props.setPIN(pin);
  };
  const classes = useStyles12();
  return /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, /* @__PURE__ */ import_react17.default.createElement(import_DialogContent2.default, {
    className: classes.validateDSKRoot
  }, /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "body1",
    className: classes.strategyGridHeadline
  }, _("Please enter the 5-digit PIN for your device and verify that the rest of the device-specific key (DSK) matches the one on your device or the manual.")), /* @__PURE__ */ import_react17.default.createElement("div", {
    className: classes.validateDSKGrid
  }, /* @__PURE__ */ import_react17.default.createElement(import_TextField.default, {
    autoFocus: true,
    variant: "outlined",
    margin: "dense",
    inputProps: {
      maxLength: 5,
      style: {textAlign: "center"}
    },
    value: pin,
    error: !!error,
    onChange: handleChange,
    onBlur: handleBlur,
    onKeyDown: (e) => {
      if (e.key === "Enter")
        handleOk();
      if (e.key === "Escape")
        props.onCancel();
    }
  }), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "body1"
  }, props.dsk), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "caption"
  }, "PIN"), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "caption"
  }, "DSK"))), /* @__PURE__ */ import_react17.default.createElement(import_DialogActions2.default, null, /* @__PURE__ */ import_react17.default.createElement(import_Button6.default, {
    disabled: pin.length !== 5,
    onClick: handleOk,
    color: "primary"
  }, _("OK")), /* @__PURE__ */ import_react17.default.createElement(import_Button6.default, {
    variant: "contained",
    onClick: props.onCancel,
    color: "primary"
  }, _("Cancel"))));
};
var ResultStep = (props) => {
  const {translate: _} = (0, import_hooks14.useI18n)();
  const classes = useStyles12();
  const Icon = props.lowSecurity ? import_Warning.default : import_CheckCircle.default;
  const caption = props.lowSecurity ? _("Node %s was added insecurely!", props.nodeId.toString()) : _("Node %s was added successfully!", props.nodeId.toString());
  const message1 = props.lowSecurity ? _("There was an error during secure inclusion. To try again, exclude the node first.") : _("Security class: %s", props.securityClass ?? _("None"));
  const message2 = _("The device is now being interviewed. It might take a while to show up.");
  return /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, /* @__PURE__ */ import_react17.default.createElement(import_DialogContent2.default, {
    className: classes.resultRoot
  }, /* @__PURE__ */ import_react17.default.createElement(Icon, {
    className: (0, import_clsx4.default)(classes.resultIcon, props.lowSecurity ? classes.resultIconLowSecurity : classes.resultIconOK)
  }), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "body1",
    style: {fontWeight: "bold", fontSize: "125%"}
  }, caption), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "body2"
  }, message1), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "body2"
  }, message2)), /* @__PURE__ */ import_react17.default.createElement(import_DialogActions2.default, null, /* @__PURE__ */ import_react17.default.createElement(import_Button6.default, {
    variant: "contained",
    onClick: props.onDone,
    color: "primary"
  }, _("OK"))));
};
var ExclusionResultStep = (props) => {
  const {translate: _} = (0, import_hooks14.useI18n)();
  const classes = useStyles12();
  return /* @__PURE__ */ import_react17.default.createElement(import_react17.default.Fragment, null, /* @__PURE__ */ import_react17.default.createElement(import_DialogContent2.default, {
    className: classes.resultRoot
  }, /* @__PURE__ */ import_react17.default.createElement(import_CheckCircle.default, {
    className: (0, import_clsx4.default)(classes.resultIcon, classes.resultIconOK)
  }), /* @__PURE__ */ import_react17.default.createElement(import_Typography5.default, {
    variant: "body2"
  }, _("Node %s was removed from the network!", props.nodeId.toString()))), /* @__PURE__ */ import_react17.default.createElement(import_DialogActions2.default, null, /* @__PURE__ */ import_react17.default.createElement(import_Button6.default, {
    variant: "contained",
    onClick: props.onDone,
    color: "primary"
  }, _("OK"))));
};
var InclusionDialog = (props) => {
  const {translate: _} = (0, import_hooks14.useI18n)();
  const Content = import_react17.default.useMemo(() => {
    switch (props.step) {
      case 0:
        return /* @__PURE__ */ import_react17.default.createElement(SelectInclusionStrategyStep, {
          selectStrategy: props.selectStrategy,
          onCancel: props.onCancel
        });
      case 1:
        return /* @__PURE__ */ import_react17.default.createElement(SelectReplacementStrategyStep, {
          selectStrategy: props.selectStrategy,
          onCancel: props.onCancel
        });
      case 2:
        return /* @__PURE__ */ import_react17.default.createElement(WaitMessageStep, {
          message: _("Put your device into inclusion mode"),
          onCancel: props.onCancel
        });
      case 3:
        return /* @__PURE__ */ import_react17.default.createElement(WaitMessageStep, {
          message: _("Put your device into exclusion mode"),
          onCancel: props.onCancel
        });
      case 4:
        return /* @__PURE__ */ import_react17.default.createElement(GrantSecurityClassesStep, {
          grantSecurityClasses: props.grantSecurityClasses,
          request: props.request,
          onCancel: props.onCancel
        });
      case 5:
        return /* @__PURE__ */ import_react17.default.createElement(ValidateDSKStep, {
          dsk: props.dsk,
          onCancel: props.onCancel,
          setPIN: props.setPIN
        });
      case 7:
        return /* @__PURE__ */ import_react17.default.createElement(ResultStep, {
          nodeId: props.nodeId,
          lowSecurity: props.lowSecurity,
          securityClass: props.securityClass,
          onDone: props.onDone
        });
      case 8:
        return /* @__PURE__ */ import_react17.default.createElement(ExclusionResultStep, {
          nodeId: props.nodeId,
          onDone: props.onDone
        });
      case 6:
        return /* @__PURE__ */ import_react17.default.createElement(WaitMessageStep, {
          message: _("Communicating with the device, please be patient...")
        });
    }
  }, [props.step]);
  return /* @__PURE__ */ import_react17.default.createElement(import_Dialog2.default, {
    open: props.isOpen,
    onClose: props.onCancel,
    "aria-labelledby": "alert-dialog-title",
    "aria-describedby": "alert-dialog-description",
    maxWidth: false
  }, /* @__PURE__ */ import_react17.default.createElement(import_DialogTitle2.default, {
    id: "alert-dialog-title"
  }, _("Include device")), Content);
};

// admin/src/pages/Devices.tsx
var Devices = () => {
  const [devices] = useDevices();
  const {alive: adapterRunning, connected: driverReady} = (0, import_hooks15.useAdapter)();
  const {namespace} = (0, import_hooks15.useGlobals)();
  const {translate: _} = (0, import_hooks15.useI18n)();
  const api = useAPI();
  const {showNotification} = (0, import_hooks15.useDialogs)();
  const [isBusy, setBusy] = import_react18.default.useState(false);
  const [inclusion] = (0, import_hooks15.useIoBrokerState)({
    id: `${namespace}.info.inclusion`,
    defaultValue: false
  });
  const [exclusion, , setExclusion] = (0, import_hooks15.useIoBrokerState)({
    id: `${namespace}.info.exclusion`,
    defaultValue: false
  });
  const [healingNetwork] = (0, import_hooks15.useIoBrokerState)({
    id: `${namespace}.info.healingNetwork`,
    defaultValue: false
  });
  const [networkHealProgress, setNetworkHealProgress] = import_react18.default.useState({});
  const [inclusionStatus, setInclusionStatus] = import_react18.default.useState();
  usePush((payload) => {
    if (payload.type === "inclusion") {
      setInclusionStatus(payload.status);
    } else if (payload.type === "healing") {
      setNetworkHealProgress(payload.status.progress ?? {});
      if (payload.status.type === "done") {
        void showNotification(_("Healing the network was successful!"), "success");
      }
    }
  });
  async function healNetwork() {
    if (!healingNetwork) {
      try {
        setNetworkHealProgress({});
        await api.beginHealingNetwork();
      } catch (e) {
        showNotification(getErrorMessage(e), "error");
        return;
      }
    }
  }
  const [showInclusionExclusionModal, setShowInclusionExclusionModal] = import_react18.default.useState(false);
  const devicesAsArray = [];
  if (devices) {
    for (const nodeId of Object.keys(devices)) {
      const device = devices[nodeId];
      if (device)
        devicesAsArray.push(device);
    }
  }
  const inclusionExclusionDialogProps = (() => {
    if (exclusion) {
      return {
        step: InclusionExclusionStep.ExcludeDevice,
        onCancel: () => {
          setShowInclusionExclusionModal(false);
          setTimeout(() => {
            setExclusion(false);
          }, 250);
        }
      };
    } else if (!inclusionStatus && !inclusion) {
      return {
        step: InclusionExclusionStep.SelectInclusionStrategy,
        onCancel: () => setShowInclusionExclusionModal(false),
        selectStrategy: async (strategy, forceSecurity) => {
          try {
            await api.beginInclusion(strategy, forceSecurity);
            setInclusionStatus({
              type: "waitingForDevice"
            });
          } catch {
            showNotification(_("Failed to start inclusion"), "error");
          }
        }
      };
    } else if (!inclusionStatus || inclusionStatus.type === "waitingForDevice") {
      return {
        step: InclusionExclusionStep.IncludeDevice,
        onCancel: () => {
          setShowInclusionExclusionModal(false);
          api.stopInclusion();
        }
      };
    } else if (inclusionStatus.type === "busy") {
      return {
        step: InclusionExclusionStep.Busy,
        onCancel: () => {
        }
      };
    } else if (inclusionStatus.type === "validateDSK") {
      return {
        step: InclusionExclusionStep.ValidateDSK,
        dsk: inclusionStatus.dsk,
        setPIN: (pin) => {
          api.validateDSK(pin);
        },
        onCancel: () => {
          api.validateDSK(false);
        }
      };
    } else if (inclusionStatus.type === "grantSecurityClasses") {
      return {
        step: InclusionExclusionStep.GrantSecurityClasses,
        request: inclusionStatus.request,
        grantSecurityClasses: (grant) => {
          api.grantSecurityClasses(grant);
        },
        onCancel: () => {
          api.grantSecurityClasses(false);
        }
      };
    } else if (inclusionStatus.type === "done") {
      return {
        step: InclusionExclusionStep.Result,
        nodeId: inclusionStatus.nodeId,
        lowSecurity: inclusionStatus.lowSecurity,
        securityClass: inclusionStatus.securityClass,
        onDone: () => {
          setShowInclusionExclusionModal(false);
          setTimeout(() => {
            setInclusionStatus(void 0);
          }, 250);
        },
        onCancel: () => {
          setShowInclusionExclusionModal(false);
          setTimeout(() => {
            setInclusionStatus(void 0);
          }, 250);
        }
      };
    } else if (inclusionStatus.type === "exclusionDone") {
      return {
        step: InclusionExclusionStep.ExclusionResult,
        nodeId: inclusionStatus.nodeId,
        onDone: () => {
          setShowInclusionExclusionModal(false);
          setTimeout(() => {
            setInclusionStatus(void 0);
          }, 250);
        },
        onCancel: () => {
          setShowInclusionExclusionModal(false);
          setTimeout(() => {
            setInclusionStatus(void 0);
          }, 250);
        }
      };
    }
  })();
  const isIncluding = inclusion || !!inclusionStatus && !exclusion && inclusionStatus.type !== "exclusionDone";
  const isExcluding = exclusion || !!inclusionStatus && !inclusion && inclusionStatus.type !== "done" && inclusionStatus.type !== "exclusionDone";
  return adapterRunning && driverReady ? /* @__PURE__ */ import_react18.default.createElement(import_react18.default.Fragment, null, /* @__PURE__ */ import_react18.default.createElement(DeviceActionButtons, {
    state: isBusy ? DeviceActionButtonsState.Busy : isIncluding ? DeviceActionButtonsState.Including : isExcluding ? DeviceActionButtonsState.Excluding : healingNetwork ? DeviceActionButtonsState.Healing : DeviceActionButtonsState.Idle,
    beginInclusion: () => setShowInclusionExclusionModal(true),
    beginExclusion: async () => {
      await setExclusion(true);
      setShowInclusionExclusionModal(true);
    },
    healNetwork,
    cancelHealing: () => api.stopHealingNetwork()
  }), /* @__PURE__ */ import_react18.default.createElement(DeviceTable, {
    isBusy: isBusy || healingNetwork,
    setBusy,
    devices: devicesAsArray,
    healingNetwork,
    networkHealProgress
  }), inclusionExclusionDialogProps && /* @__PURE__ */ import_react18.default.createElement(InclusionDialog, {
    isOpen: showInclusionExclusionModal,
    ...inclusionExclusionDialogProps
  })) : /* @__PURE__ */ import_react18.default.createElement(NotRunning, null);
};

// admin/src/pages/NetworkMap.tsx
var import_react19 = __toModule(require_react());

// node_modules/d3-array/src/ascending.js
function ascending_default(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

// node_modules/d3-array/src/range.js
function range_default(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;
  var i = -1, n = Math.max(0, Math.ceil((stop - start) / step)) | 0, range2 = new Array(n);
  while (++i < n) {
    range2[i] = start + i * step;
  }
  return range2;
}

// node_modules/d3-chord/src/math.js
var abs = Math.abs;
var cos = Math.cos;
var sin = Math.sin;
var pi = Math.PI;
var halfPi = pi / 2;
var tau = pi * 2;
var max = Math.max;
var epsilon = 1e-12;

// node_modules/d3-chord/src/chord.js
function range(i, j) {
  return Array.from({length: j - i}, (_, k) => i + k);
}
function compareValue(compare) {
  return function(a, b) {
    return compare(a.source.value + a.target.value, b.source.value + b.target.value);
  };
}
function chord_default() {
  return chord(false, false);
}
function chord(directed, transpose) {
  var padAngle = 0, sortGroups = null, sortSubgroups = null, sortChords = null;
  function chord2(matrix) {
    var n = matrix.length, groupSums = new Array(n), groupIndex = range(0, n), chords = new Array(n * n), groups = new Array(n), k = 0, dx;
    matrix = Float64Array.from({length: n * n}, transpose ? (_, i) => matrix[i % n][i / n | 0] : (_, i) => matrix[i / n | 0][i % n]);
    for (let i = 0; i < n; ++i) {
      let x = 0;
      for (let j = 0; j < n; ++j)
        x += matrix[i * n + j] + directed * matrix[j * n + i];
      k += groupSums[i] = x;
    }
    k = max(0, tau - padAngle * n) / k;
    dx = k ? padAngle : tau / n;
    {
      let x = 0;
      if (sortGroups)
        groupIndex.sort((a, b) => sortGroups(groupSums[a], groupSums[b]));
      for (const i of groupIndex) {
        const x0 = x;
        if (directed) {
          const subgroupIndex = range(~n + 1, n).filter((j) => j < 0 ? matrix[~j * n + i] : matrix[i * n + j]);
          if (sortSubgroups)
            subgroupIndex.sort((a, b) => sortSubgroups(a < 0 ? -matrix[~a * n + i] : matrix[i * n + a], b < 0 ? -matrix[~b * n + i] : matrix[i * n + b]));
          for (const j of subgroupIndex) {
            if (j < 0) {
              const chord3 = chords[~j * n + i] || (chords[~j * n + i] = {source: null, target: null});
              chord3.target = {index: i, startAngle: x, endAngle: x += matrix[~j * n + i] * k, value: matrix[~j * n + i]};
            } else {
              const chord3 = chords[i * n + j] || (chords[i * n + j] = {source: null, target: null});
              chord3.source = {index: i, startAngle: x, endAngle: x += matrix[i * n + j] * k, value: matrix[i * n + j]};
            }
          }
          groups[i] = {index: i, startAngle: x0, endAngle: x, value: groupSums[i]};
        } else {
          const subgroupIndex = range(0, n).filter((j) => matrix[i * n + j] || matrix[j * n + i]);
          if (sortSubgroups)
            subgroupIndex.sort((a, b) => sortSubgroups(matrix[i * n + a], matrix[i * n + b]));
          for (const j of subgroupIndex) {
            let chord3;
            if (i < j) {
              chord3 = chords[i * n + j] || (chords[i * n + j] = {source: null, target: null});
              chord3.source = {index: i, startAngle: x, endAngle: x += matrix[i * n + j] * k, value: matrix[i * n + j]};
            } else {
              chord3 = chords[j * n + i] || (chords[j * n + i] = {source: null, target: null});
              chord3.target = {index: i, startAngle: x, endAngle: x += matrix[i * n + j] * k, value: matrix[i * n + j]};
              if (i === j)
                chord3.source = chord3.target;
            }
            if (chord3.source && chord3.target && chord3.source.value < chord3.target.value) {
              const source = chord3.source;
              chord3.source = chord3.target;
              chord3.target = source;
            }
          }
          groups[i] = {index: i, startAngle: x0, endAngle: x, value: groupSums[i]};
        }
        x += dx;
      }
    }
    chords = Object.values(chords);
    chords.groups = groups;
    return sortChords ? chords.sort(sortChords) : chords;
  }
  chord2.padAngle = function(_) {
    return arguments.length ? (padAngle = max(0, _), chord2) : padAngle;
  };
  chord2.sortGroups = function(_) {
    return arguments.length ? (sortGroups = _, chord2) : sortGroups;
  };
  chord2.sortSubgroups = function(_) {
    return arguments.length ? (sortSubgroups = _, chord2) : sortSubgroups;
  };
  chord2.sortChords = function(_) {
    return arguments.length ? (_ == null ? sortChords = null : (sortChords = compareValue(_))._ = _, chord2) : sortChords && sortChords._;
  };
  return chord2;
}

// node_modules/d3-path/src/path.js
var pi2 = Math.PI;
var tau2 = 2 * pi2;
var epsilon2 = 1e-6;
var tauEpsilon = tau2 - epsilon2;
function Path() {
  this._x0 = this._y0 = this._x1 = this._y1 = null;
  this._ = "";
}
function path() {
  return new Path();
}
Path.prototype = path.prototype = {
  constructor: Path,
  moveTo: function(x, y) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
  },
  closePath: function() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },
  lineTo: function(x, y) {
    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  quadraticCurveTo: function(x1, y1, x, y) {
    this._ += "Q" + +x1 + "," + +y1 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  bezierCurveTo: function(x1, y1, x2, y2, x, y) {
    this._ += "C" + +x1 + "," + +y1 + "," + +x2 + "," + +y2 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  arcTo: function(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
    var x0 = this._x1, y0 = this._y1, x21 = x2 - x1, y21 = y2 - y1, x01 = x0 - x1, y01 = y0 - y1, l01_2 = x01 * x01 + y01 * y01;
    if (r < 0)
      throw new Error("negative radius: " + r);
    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    } else if (!(l01_2 > epsilon2))
      ;
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon2) || !r) {
      this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
    } else {
      var x20 = x2 - x0, y20 = y2 - y0, l21_2 = x21 * x21 + y21 * y21, l20_2 = x20 * x20 + y20 * y20, l21 = Math.sqrt(l21_2), l01 = Math.sqrt(l01_2), l = r * Math.tan((pi2 - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2), t01 = l / l01, t21 = l / l21;
      if (Math.abs(t01 - 1) > epsilon2) {
        this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
      }
      this._ += "A" + r + "," + r + ",0,0," + +(y01 * x20 > x01 * y20) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
    }
  },
  arc: function(x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r, ccw = !!ccw;
    var dx = r * Math.cos(a0), dy = r * Math.sin(a0), x0 = x + dx, y0 = y + dy, cw = 1 ^ ccw, da = ccw ? a0 - a1 : a1 - a0;
    if (r < 0)
      throw new Error("negative radius: " + r);
    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    } else if (Math.abs(this._x1 - x0) > epsilon2 || Math.abs(this._y1 - y0) > epsilon2) {
      this._ += "L" + x0 + "," + y0;
    }
    if (!r)
      return;
    if (da < 0)
      da = da % tau2 + tau2;
    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    } else if (da > epsilon2) {
      this._ += "A" + r + "," + r + ",0," + +(da >= pi2) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
    }
  },
  rect: function(x, y, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + +w + "v" + +h + "h" + -w + "Z";
  },
  toString: function() {
    return this._;
  }
};
var path_default = path;

// node_modules/d3-chord/src/array.js
var slice = Array.prototype.slice;

// node_modules/d3-chord/src/constant.js
function constant_default(x) {
  return function() {
    return x;
  };
}

// node_modules/d3-chord/src/ribbon.js
function defaultSource(d) {
  return d.source;
}
function defaultTarget(d) {
  return d.target;
}
function defaultRadius(d) {
  return d.radius;
}
function defaultStartAngle(d) {
  return d.startAngle;
}
function defaultEndAngle(d) {
  return d.endAngle;
}
function defaultPadAngle() {
  return 0;
}
function ribbon(headRadius) {
  var source = defaultSource, target = defaultTarget, sourceRadius = defaultRadius, targetRadius = defaultRadius, startAngle = defaultStartAngle, endAngle = defaultEndAngle, padAngle = defaultPadAngle, context = null;
  function ribbon2() {
    var buffer, s = source.apply(this, arguments), t = target.apply(this, arguments), ap = padAngle.apply(this, arguments) / 2, argv = slice.call(arguments), sr = +sourceRadius.apply(this, (argv[0] = s, argv)), sa0 = startAngle.apply(this, argv) - halfPi, sa1 = endAngle.apply(this, argv) - halfPi, tr = +targetRadius.apply(this, (argv[0] = t, argv)), ta0 = startAngle.apply(this, argv) - halfPi, ta1 = endAngle.apply(this, argv) - halfPi;
    if (!context)
      context = buffer = path_default();
    if (ap > epsilon) {
      if (abs(sa1 - sa0) > ap * 2 + epsilon)
        sa1 > sa0 ? (sa0 += ap, sa1 -= ap) : (sa0 -= ap, sa1 += ap);
      else
        sa0 = sa1 = (sa0 + sa1) / 2;
      if (abs(ta1 - ta0) > ap * 2 + epsilon)
        ta1 > ta0 ? (ta0 += ap, ta1 -= ap) : (ta0 -= ap, ta1 += ap);
      else
        ta0 = ta1 = (ta0 + ta1) / 2;
    }
    context.moveTo(sr * cos(sa0), sr * sin(sa0));
    context.arc(0, 0, sr, sa0, sa1);
    if (sa0 !== ta0 || sa1 !== ta1) {
      if (headRadius) {
        var hr = +headRadius.apply(this, arguments), tr2 = tr - hr, ta2 = (ta0 + ta1) / 2;
        context.quadraticCurveTo(0, 0, tr2 * cos(ta0), tr2 * sin(ta0));
        context.lineTo(tr * cos(ta2), tr * sin(ta2));
        context.lineTo(tr2 * cos(ta1), tr2 * sin(ta1));
      } else {
        context.quadraticCurveTo(0, 0, tr * cos(ta0), tr * sin(ta0));
        context.arc(0, 0, tr, ta0, ta1);
      }
    }
    context.quadraticCurveTo(0, 0, sr * cos(sa0), sr * sin(sa0));
    context.closePath();
    if (buffer)
      return context = null, buffer + "" || null;
  }
  if (headRadius)
    ribbon2.headRadius = function(_) {
      return arguments.length ? (headRadius = typeof _ === "function" ? _ : constant_default(+_), ribbon2) : headRadius;
    };
  ribbon2.radius = function(_) {
    return arguments.length ? (sourceRadius = targetRadius = typeof _ === "function" ? _ : constant_default(+_), ribbon2) : sourceRadius;
  };
  ribbon2.sourceRadius = function(_) {
    return arguments.length ? (sourceRadius = typeof _ === "function" ? _ : constant_default(+_), ribbon2) : sourceRadius;
  };
  ribbon2.targetRadius = function(_) {
    return arguments.length ? (targetRadius = typeof _ === "function" ? _ : constant_default(+_), ribbon2) : targetRadius;
  };
  ribbon2.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant_default(+_), ribbon2) : startAngle;
  };
  ribbon2.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant_default(+_), ribbon2) : endAngle;
  };
  ribbon2.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant_default(+_), ribbon2) : padAngle;
  };
  ribbon2.source = function(_) {
    return arguments.length ? (source = _, ribbon2) : source;
  };
  ribbon2.target = function(_) {
    return arguments.length ? (target = _, ribbon2) : target;
  };
  ribbon2.context = function(_) {
    return arguments.length ? (context = _ == null ? null : _, ribbon2) : context;
  };
  return ribbon2;
}
function ribbon_default() {
  return ribbon();
}

// node_modules/d3-scale/src/init.js
function initRange(domain, range2) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(domain);
      break;
    default:
      this.range(range2).domain(domain);
      break;
  }
  return this;
}

// node_modules/d3-scale/src/ordinal.js
var implicit = Symbol("implicit");
function ordinal() {
  var index = new Map(), domain = [], range2 = [], unknown = implicit;
  function scale(d) {
    var key = d + "", i = index.get(key);
    if (!i) {
      if (unknown !== implicit)
        return unknown;
      index.set(key, i = domain.push(d));
    }
    return range2[(i - 1) % range2.length];
  }
  scale.domain = function(_) {
    if (!arguments.length)
      return domain.slice();
    domain = [], index = new Map();
    for (const value of _) {
      const key = value + "";
      if (index.has(key))
        continue;
      index.set(key, domain.push(value));
    }
    return scale;
  };
  scale.range = function(_) {
    return arguments.length ? (range2 = Array.from(_), scale) : range2.slice();
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  scale.copy = function() {
    return ordinal(domain, range2).unknown(unknown);
  };
  initRange.apply(scale, arguments);
  return scale;
}

// node_modules/d3-color/src/define.js
function define_default(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition)
    prototype[key] = definition[key];
  return prototype;
}

// node_modules/d3-color/src/color.js
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex = /^#([0-9a-f]{3,8})$/;
var reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
var reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
var reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
var reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
var reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
var reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
var named = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
define_default(Color, color, {
  copy: function(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  formatHex: color_formatHex,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
  return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a) {
  if (a <= 0)
    r = g = b = NaN;
  return new Rgb(r, g, b, a);
}
function rgbConvert(o) {
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
define_default(Rgb, rgb, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
  formatHex: rgb_formatHex,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}
function rgb_formatRgb() {
  var a = this.opacity;
  a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
  return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
}
function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l, a) {
  if (a <= 0)
    h = s = l = NaN;
  else if (l <= 0 || l >= 1)
    h = s = NaN;
  else if (s <= 0)
    h = NaN;
  return new Hsl(h, s, l, a);
}
function hslConvert(o) {
  if (o instanceof Hsl)
    return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Hsl();
  if (o instanceof Hsl)
    return o;
  o = o.rgb();
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, min2 = Math.min(r, g, b), max3 = Math.max(r, g, b), h = NaN, s = max3 - min2, l = (max3 + min2) / 2;
  if (s) {
    if (r === max3)
      h = (g - b) / s + (g < b) * 6;
    else if (g === max3)
      h = (b - r) / s + 2;
    else
      h = (r - g) / s + 4;
    s /= l < 0.5 ? max3 + min2 : 2 - max3 - min2;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}
define_default(Hsl, hsl, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl: function() {
    var a = this.opacity;
    a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "hsl(" : "hsla(") + (this.h || 0) + ", " + (this.s || 0) * 100 + "%, " + (this.l || 0) * 100 + "%" + (a === 1 ? ")" : ", " + a + ")");
  }
}));
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}

// node_modules/d3-interpolate/src/basis.js
function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}
function basis_default(values) {
  var n = values.length - 1;
  return function(t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/d3-interpolate/src/basisClosed.js
function basisClosed_default(values) {
  var n = values.length;
  return function(t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/d3-interpolate/src/constant.js
var constant_default2 = (x) => () => x;

// node_modules/d3-interpolate/src/color.js
function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}
function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}
function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant_default2(isNaN(a) ? b : a);
  };
}
function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant_default2(isNaN(a) ? b : a);
}

// node_modules/d3-interpolate/src/rgb.js
var rgb_default = function rgbGamma(y) {
  var color2 = gamma(y);
  function rgb2(start, end) {
    var r = color2((start = rgb(start)).r, (end = rgb(end)).r), g = color2(start.g, end.g), b = color2(start.b, end.b), opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }
  rgb2.gamma = rgbGamma;
  return rgb2;
}(1);
function rgbSpline(spline) {
  return function(colors) {
    var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color2;
    for (i = 0; i < n; ++i) {
      color2 = rgb(colors[i]);
      r[i] = color2.r || 0;
      g[i] = color2.g || 0;
      b[i] = color2.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color2.opacity = 1;
    return function(t) {
      color2.r = r(t);
      color2.g = g(t);
      color2.b = b(t);
      return color2 + "";
    };
  };
}
var rgbBasis = rgbSpline(basis_default);
var rgbBasisClosed = rgbSpline(basisClosed_default);

// node_modules/d3-scale-chromatic/src/colors.js
function colors_default(specifier) {
  var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
  while (i < n)
    colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors;
}

// node_modules/d3-scale-chromatic/src/ramp.js
var ramp_default = (scheme2) => rgbBasis(scheme2[scheme2.length - 1]);

// node_modules/d3-scale-chromatic/src/diverging/Spectral.js
var scheme = new Array(3).concat("fc8d59ffffbf99d594", "d7191cfdae61abdda42b83ba", "d7191cfdae61ffffbfabdda42b83ba", "d53e4ffc8d59fee08be6f59899d5943288bd", "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd", "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd", "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd", "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2", "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2").map(colors_default);
var Spectral_default = ramp_default(scheme);

// node_modules/d3-selection/src/namespaces.js
var xhtml = "http://www.w3.org/1999/xhtml";
var namespaces_default = {
  svg: "http://www.w3.org/2000/svg",
  xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

// node_modules/d3-selection/src/namespace.js
function namespace_default(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns")
    name = name.slice(i + 1);
  return namespaces_default.hasOwnProperty(prefix) ? {space: namespaces_default[prefix], local: name} : name;
}

// node_modules/d3-selection/src/creator.js
function creatorInherit(name) {
  return function() {
    var document2 = this.ownerDocument, uri = this.namespaceURI;
    return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
  };
}
function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}
function creator_default(name) {
  var fullname = namespace_default(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}

// node_modules/d3-selection/src/selector.js
function none() {
}
function selector_default(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

// node_modules/d3-selection/src/selection/select.js
function select_default(select) {
  if (typeof select !== "function")
    select = selector_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node)
          subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/d3-selection/src/array.js
function array_default(x) {
  return typeof x === "object" && "length" in x ? x : Array.from(x);
}

// node_modules/d3-selection/src/selectorAll.js
function empty() {
  return [];
}
function selectorAll_default(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

// node_modules/d3-selection/src/selection/selectAll.js
function arrayAll(select) {
  return function() {
    var group = select.apply(this, arguments);
    return group == null ? [] : array_default(group);
  };
}
function selectAll_default(select) {
  if (typeof select === "function")
    select = arrayAll(select);
  else
    select = selectorAll_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }
  return new Selection(subgroups, parents);
}

// node_modules/d3-selection/src/matcher.js
function matcher_default(selector) {
  return function() {
    return this.matches(selector);
  };
}
function childMatcher(selector) {
  return function(node) {
    return node.matches(selector);
  };
}

// node_modules/d3-selection/src/selection/selectChild.js
var find = Array.prototype.find;
function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}
function childFirst() {
  return this.firstElementChild;
}
function selectChild_default(match) {
  return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/d3-selection/src/selection/selectChildren.js
var filter = Array.prototype.filter;
function children() {
  return this.children;
}
function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}
function selectChildren_default(match) {
  return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/d3-selection/src/selection/filter.js
function filter_default(match) {
  if (typeof match !== "function")
    match = matcher_default(match);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/d3-selection/src/selection/sparse.js
function sparse_default(update) {
  return new Array(update.length);
}

// node_modules/d3-selection/src/selection/enter.js
function enter_default() {
  return new Selection(this._enter || this._groups.map(sparse_default), this._parents);
}
function EnterNode(parent, datum2) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum2;
}
EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function(child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function(selector) {
    return this._parent.querySelector(selector);
  },
  querySelectorAll: function(selector) {
    return this._parent.querySelectorAll(selector);
  }
};

// node_modules/d3-selection/src/constant.js
function constant_default3(x) {
  return function() {
    return x;
  };
}

// node_modules/d3-selection/src/selection/data.js
function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0, node, groupLength = group.length, dataLength = data.length;
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}
function bindKey(parent, group, enter, update, exit, data, key) {
  var i, node, nodeByKeyValue = new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
      exit[i] = node;
    }
  }
}
function datum(node) {
  return node.__data__;
}
function data_default(value, key) {
  if (!arguments.length)
    return Array.from(this, datum);
  var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
  if (typeof value !== "function")
    value = constant_default3(value);
  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j], group = groups[j], groupLength = group.length, data = array_default(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1)
          i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength)
          ;
        previous._next = next || null;
      }
    }
  }
  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

// node_modules/d3-selection/src/selection/exit.js
function exit_default() {
  return new Selection(this._exit || this._groups.map(sparse_default), this._parents);
}

// node_modules/d3-selection/src/selection/join.js
function join_default(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null)
    update = onupdate(update);
  if (onexit == null)
    exit.remove();
  else
    onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

// node_modules/d3-selection/src/selection/merge.js
function merge_default(selection2) {
  if (!(selection2 instanceof Selection))
    throw new Error("invalid merge");
  for (var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Selection(merges, this._parents);
}

// node_modules/d3-selection/src/selection/order.js
function order_default() {
  for (var groups = this._groups, j = -1, m = groups.length; ++j < m; ) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4)
          next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
}

// node_modules/d3-selection/src/selection/sort.js
function sort_default(compare) {
  if (!compare)
    compare = ascending;
  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }
  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }
  return new Selection(sortgroups, this._parents).order();
}
function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

// node_modules/d3-selection/src/selection/call.js
function call_default() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

// node_modules/d3-selection/src/selection/nodes.js
function nodes_default() {
  return Array.from(this);
}

// node_modules/d3-selection/src/selection/node.js
function node_default() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node)
        return node;
    }
  }
  return null;
}

// node_modules/d3-selection/src/selection/size.js
function size_default() {
  let size = 0;
  for (const node of this)
    ++size;
  return size;
}

// node_modules/d3-selection/src/selection/empty.js
function empty_default() {
  return !this.node();
}

// node_modules/d3-selection/src/selection/each.js
function each_default(callback) {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i])
        callback.call(node, node.__data__, i, group);
    }
  }
  return this;
}

// node_modules/d3-selection/src/selection/attr.js
function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}
function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}
function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      this.removeAttribute(name);
    else
      this.setAttribute(name, v);
  };
}
function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      this.removeAttributeNS(fullname.space, fullname.local);
    else
      this.setAttributeNS(fullname.space, fullname.local, v);
  };
}
function attr_default(name, value) {
  var fullname = namespace_default(name);
  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }
  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}

// node_modules/d3-selection/src/window.js
function window_default(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}

// node_modules/d3-selection/src/selection/style.js
function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}
function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      this.style.removeProperty(name);
    else
      this.style.setProperty(name, v, priority);
  };
}
function style_default(name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
  return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
}

// node_modules/d3-selection/src/selection/property.js
function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}
function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}
function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      delete this[name];
    else
      this[name] = v;
  };
}
function property_default(name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}

// node_modules/d3-selection/src/selection/classed.js
function classArray(string) {
  return string.trim().split(/^|\s+/);
}
function classList(node) {
  return node.classList || new ClassList(node);
}
function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};
function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n)
    list.add(names[i]);
}
function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n)
    list.remove(names[i]);
}
function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}
function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}
function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}
function classed_default(name, value) {
  var names = classArray(name + "");
  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n)
      if (!list.contains(names[i]))
        return false;
    return true;
  }
  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}

// node_modules/d3-selection/src/selection/text.js
function textRemove() {
  this.textContent = "";
}
function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}
function text_default(value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}

// node_modules/d3-selection/src/selection/html.js
function htmlRemove() {
  this.innerHTML = "";
}
function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}
function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}
function html_default(value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}

// node_modules/d3-selection/src/selection/raise.js
function raise() {
  if (this.nextSibling)
    this.parentNode.appendChild(this);
}
function raise_default() {
  return this.each(raise);
}

// node_modules/d3-selection/src/selection/lower.js
function lower() {
  if (this.previousSibling)
    this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function lower_default() {
  return this.each(lower);
}

// node_modules/d3-selection/src/selection/append.js
function append_default(name) {
  var create = typeof name === "function" ? name : creator_default(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

// node_modules/d3-selection/src/selection/insert.js
function constantNull() {
  return null;
}
function insert_default(name, before) {
  var create = typeof name === "function" ? name : creator_default(name), select = before == null ? constantNull : typeof before === "function" ? before : selector_default(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

// node_modules/d3-selection/src/selection/remove.js
function remove() {
  var parent = this.parentNode;
  if (parent)
    parent.removeChild(this);
}
function remove_default() {
  return this.each(remove);
}

// node_modules/d3-selection/src/selection/clone.js
function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function clone_default(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

// node_modules/d3-selection/src/selection/datum.js
function datum_default(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}

// node_modules/d3-selection/src/selection/on.js
function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}
function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0)
      name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name};
  });
}
function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on)
      return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i)
      on.length = i;
    else
      delete this.__on;
  };
}
function onAdd(typename, value, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value);
    if (on)
      for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
    this.addEventListener(typename.type, listener, options);
    o = {type: typename.type, name: typename.name, value, listener, options};
    if (!on)
      this.__on = [o];
    else
      on.push(o);
  };
}
function on_default(typename, value, options) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;
  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on)
      for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
    return;
  }
  on = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i)
    this.each(on(typenames[i], value, options));
  return this;
}

// node_modules/d3-selection/src/selection/dispatch.js
function dispatchEvent(node, type, params) {
  var window = window_default(node), event = window.CustomEvent;
  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params)
      event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else
      event.initEvent(type, false, false);
  }
  node.dispatchEvent(event);
}
function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}
function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}
function dispatch_default(type, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}

// node_modules/d3-selection/src/selection/iterator.js
function* iterator_default() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i])
        yield node;
    }
  }
}

// node_modules/d3-selection/src/selection/index.js
var root = [null];
function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}
function selection() {
  return new Selection([[document.documentElement]], root);
}
function selection_selection() {
  return this;
}
Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: select_default,
  selectAll: selectAll_default,
  selectChild: selectChild_default,
  selectChildren: selectChildren_default,
  filter: filter_default,
  data: data_default,
  enter: enter_default,
  exit: exit_default,
  join: join_default,
  merge: merge_default,
  selection: selection_selection,
  order: order_default,
  sort: sort_default,
  call: call_default,
  nodes: nodes_default,
  node: node_default,
  size: size_default,
  empty: empty_default,
  each: each_default,
  attr: attr_default,
  style: style_default,
  property: property_default,
  classed: classed_default,
  text: text_default,
  html: html_default,
  raise: raise_default,
  lower: lower_default,
  append: append_default,
  insert: insert_default,
  remove: remove_default,
  clone: clone_default,
  datum: datum_default,
  on: on_default,
  dispatch: dispatch_default,
  [Symbol.iterator]: iterator_default
};

// node_modules/d3-selection/src/select.js
function select_default2(selector) {
  return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
}

// node_modules/d3-shape/src/constant.js
function constant_default4(x) {
  return function constant() {
    return x;
  };
}

// node_modules/d3-shape/src/math.js
var abs2 = Math.abs;
var atan2 = Math.atan2;
var cos2 = Math.cos;
var max2 = Math.max;
var min = Math.min;
var sin2 = Math.sin;
var sqrt = Math.sqrt;
var epsilon3 = 1e-12;
var pi3 = Math.PI;
var halfPi2 = pi3 / 2;
var tau3 = 2 * pi3;
function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi3 : Math.acos(x);
}
function asin(x) {
  return x >= 1 ? halfPi2 : x <= -1 ? -halfPi2 : Math.asin(x);
}

// node_modules/d3-shape/src/arc.js
function arcInnerRadius(d) {
  return d.innerRadius;
}
function arcOuterRadius(d) {
  return d.outerRadius;
}
function arcStartAngle(d) {
  return d.startAngle;
}
function arcEndAngle(d) {
  return d.endAngle;
}
function arcPadAngle(d) {
  return d && d.padAngle;
}
function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var x10 = x1 - x0, y10 = y1 - y0, x32 = x3 - x2, y32 = y3 - y2, t = y32 * x10 - x32 * y10;
  if (t * t < epsilon3)
    return;
  t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / t;
  return [x0 + t * x10, y0 + t * y10];
}
function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
  var x01 = x0 - x1, y01 = y0 - y1, lo = (cw ? rc : -rc) / sqrt(x01 * x01 + y01 * y01), ox = lo * y01, oy = -lo * x01, x11 = x0 + ox, y11 = y0 + oy, x10 = x1 + ox, y10 = y1 + oy, x00 = (x11 + x10) / 2, y00 = (y11 + y10) / 2, dx = x10 - x11, dy = y10 - y11, d2 = dx * dx + dy * dy, r = r1 - rc, D = x11 * y10 - x10 * y11, d = (dy < 0 ? -1 : 1) * sqrt(max2(0, r * r * d2 - D * D)), cx0 = (D * dy - dx * d) / d2, cy0 = (-D * dx - dy * d) / d2, cx1 = (D * dy + dx * d) / d2, cy1 = (-D * dx + dy * d) / d2, dx0 = cx0 - x00, dy0 = cy0 - y00, dx1 = cx1 - x00, dy1 = cy1 - y00;
  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1)
    cx0 = cx1, cy0 = cy1;
  return {
    cx: cx0,
    cy: cy0,
    x01: -ox,
    y01: -oy,
    x11: cx0 * (r1 / r - 1),
    y11: cy0 * (r1 / r - 1)
  };
}
function arc_default() {
  var innerRadius = arcInnerRadius, outerRadius = arcOuterRadius, cornerRadius = constant_default4(0), padRadius = null, startAngle = arcStartAngle, endAngle = arcEndAngle, padAngle = arcPadAngle, context = null;
  function arc() {
    var buffer, r, r0 = +innerRadius.apply(this, arguments), r1 = +outerRadius.apply(this, arguments), a0 = startAngle.apply(this, arguments) - halfPi2, a1 = endAngle.apply(this, arguments) - halfPi2, da = abs2(a1 - a0), cw = a1 > a0;
    if (!context)
      context = buffer = path_default();
    if (r1 < r0)
      r = r1, r1 = r0, r0 = r;
    if (!(r1 > epsilon3))
      context.moveTo(0, 0);
    else if (da > tau3 - epsilon3) {
      context.moveTo(r1 * cos2(a0), r1 * sin2(a0));
      context.arc(0, 0, r1, a0, a1, !cw);
      if (r0 > epsilon3) {
        context.moveTo(r0 * cos2(a1), r0 * sin2(a1));
        context.arc(0, 0, r0, a1, a0, cw);
      }
    } else {
      var a01 = a0, a11 = a1, a00 = a0, a10 = a1, da0 = da, da1 = da, ap = padAngle.apply(this, arguments) / 2, rp = ap > epsilon3 && (padRadius ? +padRadius.apply(this, arguments) : sqrt(r0 * r0 + r1 * r1)), rc = min(abs2(r1 - r0) / 2, +cornerRadius.apply(this, arguments)), rc0 = rc, rc1 = rc, t0, t1;
      if (rp > epsilon3) {
        var p0 = asin(rp / r0 * sin2(ap)), p1 = asin(rp / r1 * sin2(ap));
        if ((da0 -= p0 * 2) > epsilon3)
          p0 *= cw ? 1 : -1, a00 += p0, a10 -= p0;
        else
          da0 = 0, a00 = a10 = (a0 + a1) / 2;
        if ((da1 -= p1 * 2) > epsilon3)
          p1 *= cw ? 1 : -1, a01 += p1, a11 -= p1;
        else
          da1 = 0, a01 = a11 = (a0 + a1) / 2;
      }
      var x01 = r1 * cos2(a01), y01 = r1 * sin2(a01), x10 = r0 * cos2(a10), y10 = r0 * sin2(a10);
      if (rc > epsilon3) {
        var x11 = r1 * cos2(a11), y11 = r1 * sin2(a11), x00 = r0 * cos2(a00), y00 = r0 * sin2(a00), oc;
        if (da < pi3 && (oc = intersect(x01, y01, x00, y00, x11, y11, x10, y10))) {
          var ax = x01 - oc[0], ay = y01 - oc[1], bx = x11 - oc[0], by = y11 - oc[1], kc = 1 / sin2(acos((ax * bx + ay * by) / (sqrt(ax * ax + ay * ay) * sqrt(bx * bx + by * by))) / 2), lc = sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
          rc0 = min(rc, (r0 - lc) / (kc - 1));
          rc1 = min(rc, (r1 - lc) / (kc + 1));
        }
      }
      if (!(da1 > epsilon3))
        context.moveTo(x01, y01);
      else if (rc1 > epsilon3) {
        t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
        t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);
        context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);
        if (rc1 < rc)
          context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);
        else {
          context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
          context.arc(0, 0, r1, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
          context.arc(t1.cx, t1.cy, rc1, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
        }
      } else
        context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);
      if (!(r0 > epsilon3) || !(da0 > epsilon3))
        context.lineTo(x10, y10);
      else if (rc0 > epsilon3) {
        t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
        t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);
        context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);
        if (rc0 < rc)
          context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);
        else {
          context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
          context.arc(0, 0, r0, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
          context.arc(t1.cx, t1.cy, rc0, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
        }
      } else
        context.arc(0, 0, r0, a10, a00, cw);
    }
    context.closePath();
    if (buffer)
      return context = null, buffer + "" || null;
  }
  arc.centroid = function() {
    var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi3 / 2;
    return [cos2(a) * r, sin2(a) * r];
  };
  arc.innerRadius = function(_) {
    return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant_default4(+_), arc) : innerRadius;
  };
  arc.outerRadius = function(_) {
    return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant_default4(+_), arc) : outerRadius;
  };
  arc.cornerRadius = function(_) {
    return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant_default4(+_), arc) : cornerRadius;
  };
  arc.padRadius = function(_) {
    return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant_default4(+_), arc) : padRadius;
  };
  arc.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant_default4(+_), arc) : startAngle;
  };
  arc.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant_default4(+_), arc) : endAngle;
  };
  arc.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant_default4(+_), arc) : padAngle;
  };
  arc.context = function(_) {
    return arguments.length ? (context = _ == null ? null : _, arc) : context;
  };
  return arc;
}

// admin/src/lib/networkMap.ts
function drawNetworkMap(selector, nodes) {
  const matrix = new Array(nodes.length).fill(0).map(() => new Array(nodes.length).fill(0));
  function addLink(from, to) {
    if (from == void 0 || to == void 0)
      return;
    matrix[from][to] = matrix[to][from] = 1;
  }
  const nodeIndizes = new Map();
  for (let i = 0; i < nodes.length; i++) {
    nodeIndizes.set(nodes[i].id, i);
  }
  for (const node2 of nodes) {
    for (const neighborId of node2.neighbors) {
      addLink(nodeIndizes.get(node2.id), nodeIndizes.get(neighborId));
    }
  }
  const sum = (arr) => arr.reduce((acc, cur) => acc + cur, 0);
  let maxSum = Math.max(...matrix.map(sum));
  if (maxSum === 0)
    maxSum = 1;
  const disconnected = new Set();
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    const rowSum = sum(row);
    if (rowSum === 0) {
      row[i] = 1 / maxSum;
      disconnected.add(nodes[i].id);
    } else {
      matrix[i] = row.map((val) => val / maxSum);
    }
  }
  const node1Factor = 1.5;
  const row0Sum = sum(matrix[0]);
  matrix[0] = matrix[0].map((val) => val * node1Factor / row0Sum);
  const matrixSum = sum(matrix.map(sum));
  const width = 600;
  const height = 600;
  const outerRadius = Math.min(width, height) * 0.5 - 150;
  const innerRadius = outerRadius - 20;
  const gap = Math.min(0.15, Math.PI / 2 / nodes.length);
  const remainder = 2 * Math.PI - nodes.length * gap;
  const firstNodeRotation = 0.5 * remainder * (node1Factor / matrixSum);
  const svg = select_default2(selector).append("svg").attr("preserveAspectRatio", "xMidYMid meet").attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`).append("g").attr("transform", `rotate(-${(firstNodeRotation * (180 / Math.PI)).toFixed(2)})`);
  const chord2 = chord_default().padAngle(gap).sortChords(ascending_default).sortSubgroups(() => 1)(matrix);
  const arcs = arc_default().innerRadius(innerRadius).outerRadius(outerRadius);
  const ribbonGenerator = ribbon_default().radius(innerRadius);
  const colorScale = ordinal().domain(range_default(nodes.length - 1)).range(scheme[Math.max(3, Math.min(11, nodes.length))]);
  function getGradID(d) {
    return "linkGrad-" + d.source.index + "-" + d.target.index;
  }
  const grads = svg.append("defs").selectAll("linearGradient").data(chord2).enter().append("linearGradient").attr("id", getGradID).attr("gradientUnits", "userSpaceOnUse").attr("x1", function(d, _i) {
    return innerRadius * Math.cos((d.source.endAngle - d.source.startAngle) / 2 + d.source.startAngle - Math.PI / 2);
  }).attr("y1", function(d, _i) {
    return innerRadius * Math.sin((d.source.endAngle - d.source.startAngle) / 2 + d.source.startAngle - Math.PI / 2);
  }).attr("x2", function(d, _i) {
    return innerRadius * Math.cos((d.target.endAngle - d.target.startAngle) / 2 + d.target.startAngle - Math.PI / 2);
  }).attr("y2", function(d, _i) {
    return innerRadius * Math.sin((d.target.endAngle - d.target.startAngle) / 2 + d.target.startAngle - Math.PI / 2);
  });
  grads.append("stop").attr("offset", "0%").attr("stop-color", (d) => colorScale(d.source.index));
  grads.append("stop").attr("offset", "100%").attr("stop-color", (d) => colorScale(d.target.index));
  const node = svg.selectAll("g").data(chord2.groups).enter().append("g").attr("class", "node");
  node.append("path").style("fill", (d) => colorScale(d.index)).attr("d", arcs);
  node.append("text").each((d) => d.angle = (d.startAngle + d.endAngle) / 2).attr("class", (_d, i) => `node-id${disconnected.has(nodes[i].id) ? " disconnected" : ""}`).attr("text-anchor", (d) => d.angle - firstNodeRotation > Math.PI ? "end" : null).attr("dominant-baseline", "middle").attr("transform", (d) => {
    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (outerRadius + 10) + ")" + (d.angle - firstNodeRotation > Math.PI ? "rotate(180)" : "");
  }).text((_d, i) => `Node ${nodes[i].id}`);
  svg.datum(chord2).append("g").selectAll("path").data((d) => d.filter((c) => c.source.index !== c.target.index && c.source.value > 0 && c.target.value > 0)).enter().append("path").attr("class", (d) => `chord chord-${d.source.index} chord-${d.target.index}`).style("fill", (d) => `url(#${getGradID(d)})`).attr("d", ribbonGenerator);
}

// admin/src/pages/NetworkMap.tsx
var import_hooks16 = __toModule(require_hooks());
var NetworkMap = () => {
  const {alive: adapterRunning, connected: driverReady} = (0, import_hooks16.useAdapter)();
  const api = useAPI();
  import_react19.default.useEffect(() => {
    if (adapterRunning && driverReady) {
      api.getNetworkMap().then((nodes) => {
        drawNetworkMap("#map", nodes);
      }).catch((e) => {
        console.error(e);
      });
    }
  }, [adapterRunning, driverReady, api]);
  return adapterRunning && driverReady ? /* @__PURE__ */ import_react19.default.createElement("div", {
    id: "map"
  }) : /* @__PURE__ */ import_react19.default.createElement(NotRunning, null);
};

// admin/src/tab.tsx
var import_hooks17 = __toModule(require_hooks());
var import_react_error_boundary = __toModule(require_react_error_boundary_umd());
function ErrorFallback({error, resetErrorBoundary}) {
  return /* @__PURE__ */ import_react20.default.createElement("div", {
    role: "alert"
  }, /* @__PURE__ */ import_react20.default.createElement("p", null, "Something went wrong:"), /* @__PURE__ */ import_react20.default.createElement("pre", null, error.stack), /* @__PURE__ */ import_react20.default.createElement("button", {
    onClick: resetErrorBoundary
  }, "Try again"));
}
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
var Root = import_react20.default.memo(() => {
  const [value, setValue] = import_react20.default.useState(0);
  const {translate: _} = (0, import_hooks17.useI18n)();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return /* @__PURE__ */ import_react20.default.createElement(import_react20.default.Fragment, null, /* @__PURE__ */ import_react20.default.createElement(import_core2.AppBar, {
    position: "static"
  }, /* @__PURE__ */ import_react20.default.createElement(import_core2.Tabs, {
    value,
    onChange: handleChange
  }, /* @__PURE__ */ import_react20.default.createElement(import_core2.Tab, {
    label: _("Devices")
  }), /* @__PURE__ */ import_react20.default.createElement(import_core2.Tab, {
    label: _("Associations")
  }), /* @__PURE__ */ import_react20.default.createElement(import_core2.Tab, {
    label: _("Network map")
  }))), /* @__PURE__ */ import_react20.default.createElement(TabPanel, {
    value,
    index: 0
  }, /* @__PURE__ */ import_react20.default.createElement(import_react_error_boundary.ErrorBoundary, {
    FallbackComponent: ErrorFallback
  }, /* @__PURE__ */ import_react20.default.createElement(Devices, null))), /* @__PURE__ */ import_react20.default.createElement(TabPanel, {
    value,
    index: 1
  }, /* @__PURE__ */ import_react20.default.createElement(import_react_error_boundary.ErrorBoundary, {
    FallbackComponent: ErrorFallback
  }, /* @__PURE__ */ import_react20.default.createElement(Associations, null))), /* @__PURE__ */ import_react20.default.createElement(TabPanel, {
    value,
    index: 2
  }, /* @__PURE__ */ import_react20.default.createElement(import_react_error_boundary.ErrorBoundary, {
    FallbackComponent: ErrorFallback
  }, /* @__PURE__ */ import_react20.default.createElement(NetworkMap, null))));
});
import_react_dom.default.render(/* @__PURE__ */ import_react20.default.createElement(import_app.IoBrokerApp, {
  name: "zwave2",
  translations
}, /* @__PURE__ */ import_react20.default.createElement(Root, null)), document.getElementById("root"));
//# sourceMappingURL=tab.js.map
