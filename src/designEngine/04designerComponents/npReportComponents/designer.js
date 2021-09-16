//import "@grapecity/wyn-report-designer/dist/designer-app.js";
//const aaa = require("@grapecity/wyn-report-designer/dist/designer-app.js")
export const createDesigner = (portalUrl, referenceToken, onSavedReport) => {
    //window.console.log('-----------------aaa',aaa)    
    //window.console.log('-----------------window.designer',window.designer)    
    window.console.log('-----------------designer',designer)
    var baseServerApi = designer.getBaseServerApi(portalUrl, referenceToken);

    var showElement = function (id) {
        if (!id) return;
        document.getElementById(id).style.display = 'block'
    };

    var hideElement = function (id) {
        if (!id) return;
        document.getElementById(id).style.display = 'none'
    };

    var designerId = 'designer-id';
    var saveAsDialogId = 'save-as-dialog-id';
    var saveDialogId = 'save-dialog-id';
    var dataSetPickerDialogId = 'data-set-picker-dialog-id';

    var showDesigner = function () {
        var info = designer.api.getReportInfo();
        var isDirty = designer.api.isReportDirty();
        document.title = info.name + (isDirty ? ' *' : '');
        showElement(designerId);
        designer.focus();
    };

    function showSaveDialog(options) {
        showElement(saveDialogId);
        options.createSaveReportDialog(saveDialogId, {
            serverApi: {
                saveReportById: baseServerApi.saveExistingReport,
            },
            locale: options.locale,
            reportInfo: {
                id: options.reportInfo.id,
                name: options.reportInfo.name,
                content: options.reportInfo.content,
            },
            onSuccess: function (saveResult) {
                onSavedReport && onSavedReport(saveResult);
                hideElement(saveDialogId);
                showDesigner();
                options.onSuccess(saveResult);
                //另存之后获取到id和name
                console.log('name',saveResult.name);
                console.log('id',saveResult.id);
            },
            onClose: function () {
                hideElement(saveDialogId);
                showDesigner();
            },
        });
    }

    function showSaveAsDialog(options) {
        showElement(saveAsDialogId);
        var isTemplateSaved = false;
        options.createSaveReportAsDialog(saveAsDialogId, {
            serverApi: {
                getReportsList: baseServerApi.getReportsList,
                getTagsList: baseServerApi.getTagsList,
                saveReportByName: baseServerApi.saveNewReport,
                saveReportById: baseServerApi.saveExistingReport,
                templates: {
                    saveTemplateByName: function (options) {
                        return baseServerApi.saveNewTemplate(options).then(function (saveResult) {
                            isTemplateSaved = true;
                            return saveResult;
                        });
                    },
                    getTemplatesList: baseServerApi.getTemplatesList,
                    saveTemplateById: function (options) {
                        return baseServerApi.saveExistingTemplate(options).then(function (saveResult) {
                            isTemplateSaved = true;
                            return saveResult;
                        })
                    },
                },
                tagReport: baseServerApi.setReportTags,
                getRolesList: baseServerApi.getRolesList,
                setReportPermissions: baseServerApi.setReportPermissions,
            },
            externalComponentRender: WynReportCommandsComponent && WynReportCommandsComponent.create(options.reportInfo.id, referenceToken, portalUrl, options.locale),
            locale: options.locale,
            reportInfo: {
                name: options.reportInfo.name,
                content: options.reportInfo.content,
            },
            onSuccess: function (saveResult) {
                onSavedReport && onSavedReport(saveResult);
                hideElement(saveAsDialogId);
                showDesigner();
                options.onSuccess(saveResult);
                //第一次保存之后获取到id和name
                console.log('name',saveResult.name);
                console.log('id',saveResult.id);
                //let reportId = document.getElementById('app-edit-report-id')
                //document.getElementById('app-edit-report-id').value = saveResult.id
                //window.console.log('----------------保存报表id',reportId)
                if (isTemplateSaved) {
                    baseServerApi.updateTemplateRoute(saveResult);
                    location.reload();
                }
            },
            onClose: function () {
                hideElement(saveAsDialogId);
                showDesigner();
            },
        });
    }

    var designerServerApi = designer.extendOptions(baseServerApi, {
        getDataSetSchema: function (options) {
            var optionsEx = designer.extendOptions(options, {
                getErrorMessage: dataSetPicker.getErrorMessage,
            });
            return baseServerApi.getDataSetSchema(optionsEx);
        },
        // Here you can specify/overwrite certain functions
        // for testing purposes.
    });

    var designerOptions = designer.createDesignerOptions(designerServerApi);
    if (designerOptions.locale === 'en') {
        designerOptions.aboutInfo.applicationTitle = 'WynReports Designer';
        designerOptions.aboutInfo.applicationTitleCompact = 'WynReports Designer';
    }

    designerOptions.customExpressionCommonValues = [
        { value: 'UserContext', key: 'userContext', },
    ];
    designerOptions.customExpressionFunctions = [
        { group: 'conversion', value: 'UserContext.NumberToWords()', key: 'numberToWords' },
        { group: 'miscellaneous', value: 'UserContext.GetValue()', key: 'getValue' },
    ];
    designerOptions.saveButton.visible = true;
    designerOptions.onSave = showSaveDialog;

    designerOptions.saveAsButton.visible = true;
    designerOptions.onSaveAs = showSaveAsDialog;

    designerOptions.dataTab.dataSources.canModify = true;

    var viewer = null;
    designerOptions.openViewer = function (options) {
        if (viewer) {
            viewer.openReport(options.reportInfo.id);
        }
        else {
            viewer = GrapeCity.ActiveReports.JSViewer.create({
                element: '#' + options.element,
                reportID: options.reportInfo.id,
                locale: options.locale,
                reportService: {
                    url: portalUrl,
                    securityToken: referenceToken,
                }
            });
        }
    };

    designerOptions.dataTab.dataSets.canModify = true;
    designerOptions.dataSetPicker.open = function (options) {
        var openInPanel = options.mode === 'Panel';
        if (!openInPanel) showElement(dataSetPickerDialogId);
        dataSetPicker.renderDataSetPicker(openInPanel ? options.elementId : dataSetPickerDialogId, designer.extendOptions(options, {
            serverApi: {
                getSemanticModelsList: baseServerApi.getSemanticModelsList,
                getSemanticModelSummary: baseServerApi.getSemanticModelSummary,
                getSemanticDataSourceAndDataSet: baseServerApi.getSemanticDataSourceAndDataSet,
                isSemanticDataSource: baseServerApi.isSemanticDataSource,
                getSemanticDataSourceInfo: baseServerApi.getSemanticDataSourceInfo,

                getDataSourcesList: baseServerApi.getDataSourcesList,
                getDataSetsList: baseServerApi.getDataSetsList,
                getServerDataSetInfo: baseServerApi.getServerDataSetInfo,

                getDataSourcesAndDataSets: baseServerApi.getDataSourcesAndDataSets,
            },
            onClose: function () {
                options.onClose();
                if (!openInPanel) hideElement(dataSetPickerDialogId);
                dataSetPicker.dispose();
                showDesigner();
            }
        }));
    };

    designerOptions.dataSetPicker.close = function () {
        dataSetPicker.dispose();
    };

    var templateId = '';
    designerOptions.restoreUnsavedReport = !templateId;
    designer.renderApplication(designerId, designerOptions).then(function () {
        if (!templateId) return;

        designer.api.createReport({
            templateInfo: {
                id: templateId,
            },
        });
    });

    //添加一个json对象类型来测试
    var jsonObject = {}

    var jsonObjectString = JSON.stringify(jsonObject);
    var templateContent = {
        "Name":"Report",
        "Type":"report",
        "Body":{
            "Type":"section",
            "Name":"Body",
            "Height":"2pt",
            "ReportItems":[],
            "Style":{"StyleName":"=\"\""}
        },
        "ReportParameters":[{
            "Type":"reportparameter",
            "DataType":"String",
            "DefaultValue":{"Values":[jsonObjectString]},
            "Name":"参数1",
            "Prompt":"参数1"
        }],
        "DataSources":[{
            "Name":"DataSource1",
            "Transaction":false,
            "DataSourceReference":"",
            "ConnectionProperties":{
                "DataProvider":"JSON",
                "ConnectString":"=\"jsondata=\" &Parameters!参数1.Value",
                "IntegratedSecurity":false,
                "Prompt":"",
                "Collation":"",
                "AccentSensivity":"Auto",
                "WidthSensivity":"Auto"}
        }
        ],
        "DataSets":[{
            "Name":"DataSet1",
            "Fields":[
                {"Name":"aaa","DataField":"aaa"},
                {"Name":"bbb","DataField":"bbb"},
                {"Name":"ccc","DataField":"ccc"},
                {"Name":"ddd","DataField":"ddd"}
            ],
            "Query":{"DataSourceName":"DataSource1","CommandType":"Text","CommandText":"$.[*]","Timeout":0},
            "CaseSensitivity":"Auto",
            "Collation":"",
            "KanatypeSensitivity":"Auto",
            "AccentSensitivity":"Auto",
            "WidthSensitivity":"Auto"
        },
            {
                "Name":"DataSet2",
                "Fields":[
                    {"Name":"project_name","DataField":"project_name"},
                    {"Name":"product_id","DataField":"product_id"},
                    {"Name":"line_name","DataField":"line_name"},
                    {"Name":"id","DataField":"id"}
                ],
                "Query":{"DataSourceName":"DataSource1","CommandType":"Text","CommandText":"$.content[*]","Timeout":0},
                "CaseSensitivity":"Auto",
                "Collation":"",
                "KanatypeSensitivity":"Auto",
                "AccentSensitivity":"Auto",
                "WidthSensitivity":"Auto"
            }],
        "Page":{
            "PageWidth":"21cm",
            "PageHeight":"29.7cm",
            "PageOrientation":"Portrait",
            "RightMargin":"1cm",
            "LeftMargin":"1cm",
            "TopMargin":"1cm",
            "BottomMargin":"1cm",
            "ColumnSpacing":"0cm"
        },
        "Width":"2pt",
        "CustomProperties":[
            {"Name":"Theme","Value":"server:///ce125aa7-b1ff-4f29-aa5d-8cc8b39b9ff9"},
            {"Name":"DisplayType","Value":"Page"},
            {"Name":"SizeType","Value":"Default"}
        ],
        "StartPageNumber":1,
        "DataElementName":"Report",
        "DocumentMap":{"Source":"All","NumberingStyle":"None"},
        "Layers":[{"Type":"layer","Name":"default","DesignerLock":false,"DesignerTransparency":0.0,"DesignerVisible":true,"TargetDevice":"All"}],
        "ConsumeContainerWhitespace":true,
        "ThemeUri":"server:///ce125aa7-b1ff-4f29-aa5d-8cc8b39b9ff9",
        "Themes":["server:///ce125aa7-b1ff-4f29-aa5d-8cc8b39b9ff9"]
    }

    return {
        createReport: (param) => {
            //开始创建报表
            if (param instanceof Object){
                templateContent.DataSets = []
                let keyArr = Object.keys(param)
                for (let idx = 0;idx<keyArr.length;idx++){
                    templateContent.DataSets.push({
                        "Name":keyArr[idx],
                        "Fields":param[keyArr[idx]],
                        "Query":{"DataSourceName":"DataSource1","CommandType":"Text","CommandText":"$."+keyArr[idx]+"[*]","Timeout":0},
                        "CaseSensitivity":"Auto",
                        "Collation":"",
                        "KanatypeSensitivity":"Auto",
                        "AccentSensitivity":"Auto",
                        "WidthSensitivity":"Auto"
                    })
                }
                window.console.error('-------------------开始创建',keyArr)
            }

            //templateContent.DataSets[0].Fields = param
            //templateContent.DataSets[1].Fields = []
            let templateInfo = {
                name: 'empty-template-模板',
                content: templateContent,
            }
            designer.api.createReport({
                templateInfo
            })
            //document.getElementById('wyn-designer-root').style.display = ''
        },
        openReport: (report) => {
            const reportInfo = {
                id: report.id,
                name: report.name,
                permissions: ['all']
            }
            designer.api.openReport({ reportInfo })
            //document.getElementById('wyn-designer-root').style.display = ''
        },
        close: () => {
            document.getElementById('wyn-designer-root').style.display = 'none'
        }
    }
}
