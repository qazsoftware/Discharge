// list of options to put in storage
const options = ["youtube_home_algorithm_blocking", "youtube_videos_algorithm_blocking", 
"youtube_other_algorithm_blocking", "pintrest_home_algorithm_blocking",
"pintrest_pins_algorithm_blocking", "reddit_home_algorithm_blocking",

"facebook_home_algorithm_blocking", "facebook_posts_algorithm_blocking",
"instagram_home_algorithm_blocking", "instagram_posts_algorithm_blocking",
"short_video_algorithm_blocking", "twitter_full_algorithm_blocking",

"youtube_site_blocking", "instagram_site_blocking",
"twitter_site_blocking", "reddit_site_blocking",
"pintrest_site_blocking", "facebook_site_blocking",
"tiktok_site_blocking", "all_off"
];

const urls = [
"facebook_home_algorithm_url", "facebook_posts_algorithm_url",
"instagram_home_algorithm_url", "instagram_posts_algorithm_url",
"short_video_algorithm_url", "twitter_full_algorithm_url",
];

// putting them in storage
chrome.runtime.onInstalled.addListener(() => {
    options.forEach((option) => {chrome.storage.sync.set({[option]: false});});
    urls.forEach((option) => {chrome.storage.sync.set({[option]: ""});});
});

// executing on load and tab switch
chrome.storage.sync.get("all_off", async ({ all_off }) => { if (!all_off){
    chrome.tabs.onUpdated.addListener(async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: all,
        });
    });
    chrome.tabs.onActivated.addListener(async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: all,
        });
    });
}})

// code executed in the tab
function all(){
    
    algorithmBlocking();
    siteBlocking();
    redirects();

    function algorithmBlocking(){
        const options = ["youtube_home_algorithm_blocking", "youtube_videos_algorithm_blocking", 
        "youtube_other_algorithm_blocking", "pintrest_home_algorithm_blocking",
        "pintrest_pins_algorithm_blocking", "reddit_home_algorithm_blocking"]

        const urlDetector = [
            (document.URL === "https://www.youtube.com/" || document.URL === "http://www.youtube.com/" || document.URL === "https://youtube.com/"), 
            (document.URL.split("?")[0] === "https://www.youtube.com/watch" ||document.URL.split("?")[0] === "http://www.youtube.com/watch"), 
            (document.URL.split("?")[0] === "https://www.youtube.com/results"), 
            (document.URL.split(".")[1] === "pinterest" && document.URL.split("/")[3] === ""),
            (document.URL.split(".")[1] === "pinterest" && document.URL.split("/")[3] !== undefined),
            (document.URL === "https://www.reddit.com/"),
        ];

        const queries = [
            ["ytd-browse"], ["div#related.style-scope.ytd-watch-flexy", "div.ytp-endscreen-content"],
            ["dismissible"], ["div.gridCentered"], ["div.gridCentered"], 
            ["div._1OVBBWLtHoSPfGCRaPzpTf._3nSp9cdBpqL13CqjdMr2L_._2OVNlZuUd8L9v0yVECZ2iA"]
        ];
        options.forEach(algBlocking)

        function algBlocking(option, index){
            chrome.storage.sync.get([option], (result) => {
                const data = result[option];
                console.log("[Discharge]: Updated!");

                if(data){
                    if(urlDetector[index]){
                        queries[index].forEach((query) => {
                            document.querySelector(query).innerHTML = "";
                        });
                    }
                }
            });
        }
    }
    
    function siteBlocking(){
        const options = ["youtube_site_blocking", "instagram_site_blocking",
        "twitter_site_blocking", "reddit_site_blocking",
        "pintrest_site_blocking", "facebook_site_blocking",
        "tiktok_site_blocking"
        ];

        const urls = ["www.youtube.com", "www.instagram.com","twitter.com",
        "www.reddit.com", "pinterest", "www.facebook.com", "www.tiktok.com"];
        options.forEach(steBlocking);

        function steBlocking(option, index) {
            chrome.storage.sync.get([option], (result) => {
                const data = result[option];
                console.log("[Discharge]: Updated!");

                if(data){
                    function block(){
                        document.head.innerHTML = "";
                        document.body.innerHTML = "<p><strong>" + urls[index] +
                        " has been blocked with the <i>Discharge</i>" + 
                        " extension.</strong></p><p>You can change this by simply opening the extension.</p>";
                    }

                    if(document.URL.split("/")[2] == urls[index]){
                        block();
                    }
                    if(index == 5){
                        if(document.URL.split(".")[1] === urls[index] &&
                        document.URL.split("/")[3] !== undefined) {
                            block();
                        }
                    }
                }
            });
        }
    }
    
    function redirects(){
        const options = ["facebook_home_algorithm_blocking", "facebook_posts_algorithm_blocking",
        "instagram_home_algorithm_blocking", "instagram_posts_algorithm_blocking",
        "short_video_algorithm_blocking", "twitter_full_algorithm_blocking"];

        const urlDetector = [(
        document.URL === "https://www.facebook.com/" || document.URL === "http://www.facebook.com/" || 
        document.URL === "https://facebook.com/"), 
        (document.URL === "https://www.facebook.com/watch" || document.URL === "http://www.facebook.com/watch" || 
        document.URL === "https://facebook.com/watch"),
        (document.URL === "https://www.instagram.com/" || document.URL === "http://www.instagram.com/" ||
        document.URL === "https://instagram.com/"),
        (document.URL === "https://www.instagram.com/explore/" || document.URL === "http://www.instagram.com/explore/" ||
        document.URL === "https://instagram.com/explore/"),
        ((document.URL.split("/")[3] === "shorts" && document.URL.split("/")[2] === "www.youtube.com") ||
        document.URL.split("/")[2] === "www.tiktok.com"),
        (document.URL.split("/")[2] === "twitter.com")];

        const urls = ["facebook_home_algorithm_url", "facebook_posts_algorithm_url",
        "instagram_home_algorithm_url", "instagram_posts_algorithm_url",
        "short_video_algorithm_url", "twitter_full_algorithm_url"];
        options.forEach(redir);

        function redir(option, index) {
            chrome.storage.sync.get([option], (result) => {
                const data = result[option];
                console.log("[Discharge]: Updated!");

                if(data){
                    if(urlDetector[index]){
                        chrome.storage.sync.get(urls[index], (url) => {
                            window.location.href = url[urls[index]];
                        });
                    }
                }
            });
        }
    }
}