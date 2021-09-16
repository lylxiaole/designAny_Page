export const createViewer = (portalUrl, referenceToken) => {
    const viewer = GrapeCity.ActiveReports.JSViewer.create({
        element: '#wyn-viewer-root',
        reportID: '',
        reportService: {
            url: portalUrl,
            securityToken: referenceToken,
        }
    });
    return {
        openReport: (reportId,jsonData) => {
            var jsonDataString = JSON.stringify(jsonData);
            var parameterData = [
                {
                    name: '参数1',
                    values: [jsonDataString]
                }
            ];
            //window.console.log('--------------打开报表',reportId)           
            viewer.openReport(
                reportId,
                parameterData
            )            
            //document.getElementById('wyn-viewer-root').style.display = ''
        },
        close: () => {
            document.getElementById('wyn-viewer-root').style.display = 'none'
        }
    }
}
