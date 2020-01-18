export class SharedService {
    static URL_CORS_ANYWHERE = 'https://cors-anywhere.herokuapp.com/'

    static getCompleteUrl(url: string, param: string) {
        return SharedService.URL_CORS_ANYWHERE + url.replace('#VAR#', param)
    }
}
