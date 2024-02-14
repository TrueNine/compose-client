import path from "node:path";

/**
 * css变量名
 */
export type ScssVariableDefs = Record<`$${string}`, `${string | number};`>;

/**
 * 操他妈的只能黑白配色
 */
export type BlackAndWhite = "black" | "white";

/**
 * 导航栏头部配置
 */
export interface TitleStyleConfig {
    bgColor?: ColorHex;
    textColor?: BlackAndWhite;
}

/**
 * 自定义可定义的主题，用来覆盖全局所有配置
 */
export interface ThemeDef {
    primaryColor?: ColorHex;
    primaryColorDisabled?: ColorHex;
    primaryColorDark?: ColorHex;
    primaryColorLight?: ColorHex;

    infoColor?: ColorHex;
    infoColorDisabled?: ColorHex;
    infoColorDark?: ColorHex;
    infoColorLight?: ColorHex;

    secondaryColor?: ColorHex;
    secondaryColorDisabled?: ColorHex;
    secondaryColorDark?: ColorHex;
    secondaryColorLight?: ColorHex;

    successColor?: ColorHex;
    successColorDisabled?: ColorHex;
    successColorDark?: ColorHex;
    successColorLight?: ColorHex;

    warningColor?: ColorHex;
    warningColorDisabled?: ColorHex;
    warningColorDark?: ColorHex;
    warningColorLight?: ColorHex;

    errorColor?: ColorHex;
    errorColorDisabled?: ColorHex;
    errorColorDark?: ColorHex;
    errorColorLight?: ColorHex;
}

/**
 * # uniapp 全局自定义配置
 *
 * 不要问我为什么这里不能配什么什么
 *
 * 1. 诸如：globalVarName version description 配在 package.json 它不香么？
 * 2. 有些配置是默认的最优配置，如果不服请提 issue 我肯定改
 * 3. 这个插件我只想兼容小程序，App用别的技术栈不好么？
 */
export interface UniAppConfig {
    appid?: string;
    pages?: ({ path: string; title?: string } & TitleStyleConfig)[];
    /**
     * 此配置会直接混合到 pages.json
     */
    nativePages?: UniAppPagesJson;
    /**
     * 此配置会直接混合到 manifest.json
     */
    nativeManifest?: UniAppManifestJson;
    optimization?: {
        /**
         * 打包时开启 terser 优化
         */
        useTerser?: boolean;
        /**
         * 微信分包
         */
        wechatSubPackage?: boolean;
        wechatEs6?: boolean;
        wechatMinified?: boolean;
        wechatLazyCodeLoading?: boolean;
    };
    root?: {
        /**
         * 引入了 vk uview 框架，会进行相应处理
         */
        useVkUView?: boolean;

        /**
         * 引入自带的 u-xxx 组件库
         */
        useUni?: boolean;

        /**
         * 要自己覆盖到 uni.scss 的变量
         */
        useScssVars?: ScssVariableDefs;
    };

    /**
     * 全局配置
     */
    style?: {
        transformPx?: boolean;
        theme?: ThemeDef;

        title?: TitleStyleConfig;
        tabBar?: {
            bgColor?: ColorHex;
            textColor?: ColorHex;
            borderColor?: ColorHex;
            activeBgColor?: ColorHex;
        };
    };

    /**
     * 底部导航栏配置
     */
    tabBar?: {
        path: string;
        title?: string;
    }[];

    /**
     * 微信小程序
     */
    wechat?: {
        appId: string;
        /**
         * 真机调试，允许超标到 4MB
         */
        bigPackageSizeSupport?: boolean;
    };
}

/**
 * 颜色 hex
 */
export type ColorHex = `#${string}`;

/**
 * pages.json 底部导航栏配置
 */
export interface PagesJsonGlobalStyleTabBarStyle {
    color?: ColorHex;
    selectedColor?: ColorHex;
    borderStyle?: ColorHex;
    backgroundColor?: ColorHex;
}

/**
 * uniapp manifest 配置
 */
export interface UniAppManifestJson {
    vueVersion?: "3";
    name?: string;
    appid?: string;
    description?: string;
    versionName?: string;
    versionCode?: string;
    transformPx?: boolean;
    "mp-weixin"?: {
        appid: string;
        setting?: {
            urlCheck?: boolean;
            es6?: boolean;
            postcss?: boolean;
            minified?: boolean;
            bigPackageSizeSupport?: boolean;
        };
        optimization?: {
            subPackages?: boolean;
        };
        lazyCodeLoading?: "requiredComponents";
        usingComponents?: boolean;
    };
    "mp-alipay"?: {
        usingComponents?: boolean;
    };
    "mp-toutiao"?: {
        usingComponents?: boolean;
    };
    uniStatistics?: {
        enable?: false;
    };
}

/**
 * uniapp pages.json 配置
 */
export interface UniAppPagesJson {
    transformPx?: boolean;
    easycom?: {
        autoscan?: boolean;
        custom?: Record<string, string>;
    };
    pages?: {
        path: string;
        style?: {
            navigationBarTitleText?: string;
            navigationBarBackgroundColor?: ColorHex;
            navigationBarTextStyle?: "black" | "white";
        };
    }[];
    globalStyle?: {
        navigationBarTextStyle?: "white" | "black";
        navigationBarTitleText?: string;
        navigationBarBackgroundColor?: ColorHex;
        backgroundColor?: ColorHex;
        enablePullDownRefresh?: boolean;
    };
    tabBar?: PagesJsonGlobalStyleTabBarStyle & {
        list?: {
            pagePath?: string;
            text?: string;
        }[];
    };
}

/**
 * 插件配置信息
 */
export interface PluginConfig {
    /**
     * 全局 uniapp配置
     */
    config: UniAppConfig;
    /**
     * 项目根路径
     * @default process.cwd()
     */
    rootDir?: string;

    /**
     * 调试开关
     * @default false
     */
    debugMode?: boolean;

    /**
     * pages.json 路径
     */
    pages?: string;

    /**
     * uni.scss 路径
     */
    uniScss?: string;
    /**
     * mainfest.json 路径
     */
    manifest?: string;

    /**
     * 是否在乱七八糟的json文件内包含了注释，最好他妈的不要包含
     */
    useJsonComment?: boolean;

    /**
     * npm pa
     */
    packageJson?: string;
}

/**
 * @param root 加载根路径
 * @param c 用户配置
 * @returns 全部不为空的配置
 */
export function parseConfig(root: string, c?: PluginConfig): Required<PluginConfig> {
    const r = (def: string, e: string = root) => path.resolve(e, def);
    return {
        rootDir: c?.rootDir ?? process.cwd(),
        debugMode: c?.debugMode === true,
        config: c?.config ?? {},
        packageJson: r(c?.packageJson ?? "package.json"),
        pages: r(c?.pages ?? "src/pages.json"),
        manifest: r(c?.manifest ?? "src/manifest.json"),
        uniScss: r(c?.uniScss ?? "src/uni.scss"),
        useJsonComment: c?.useJsonComment ?? false,
    };
}
