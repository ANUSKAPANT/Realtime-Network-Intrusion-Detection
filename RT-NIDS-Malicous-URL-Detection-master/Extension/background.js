// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function send_url(url){
	var xhr=new XMLHttpRequest();
	var params="url_link="+url;
	xhr.open("POST","http://127.0.0.1:8000/url",true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(params);
	var response = xhr.responseText;
	console.log(response)
	return xhr.responseText;
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	 console.log(tab.url);
	 send_url(tab.url);
}); 

chrome.tabs.onActivated.addListener(function(activeInfo) {
  // how to fetch tab url using activeInfo.tabid
  chrome.tabs.get(activeInfo.tabId, function(tab){
		 console.log(tab.url);
		 send_url(tab.url);
  });
});


