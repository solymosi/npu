// ==UserScript==
// @name           Neptun PowerUp!
// @namespace      http://example.org
// @description    Felturbózza a Neptun-odat
// @version        1.47
// @include        https://*neptun*/*hallgato*/*
// @include        https://*hallgato*.*neptun*/*
// @include        https://netw6.nnet.sze.hu/hallgato/*
// @include        https://nappw.dfad.duf.hu/hallgato/*
// @include        https://host.sdakft.hu/*
// @include        https://neptun.ejf.hu/ejfhw/*
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_info
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// ==/UserScript==

var npu = {
	
	/* == STARTUP == */
	
		/* Run features */
		init: function() {
			this.initParameters();
			this.initStorage();
			
			if(this.isLogin()) {
				this.initUserSelect();
				this.initAutoLogin();
				this.fixWaitDialog();
			}
			else {
				this.hideHeader();
				this.fixTitle();
				this.fixMenu();
				this.fixTermSelect();
				this.fixPagination();
				this.initKeepSession();
				this.initProgressIndicator();
				
				if(this.isPage("0203") || this.isPage("c_common_timetable")) {
					this.fixTimetable();
				}
				
				if(this.isPage("0206") || this.isPage("h_markbook")) {
					this.fixMarkList();
				}
				
				if(this.isPage("0222") || this.isPage("h_advance")) {
					this.fixProgressList();
				}
				
				if(this.isPage("0303") || this.isPage("h_addsubjects")) {
					this.fixCourseList();
					this.initCourseAutoList();
					this.initCourseStore();
				}
				
				if(this.isPage("0401") || this.isPage("h_exams")) {
					this.fixExamList();
					this.initExamAutoList();
				}
				
				this.initStat();
			}
		},
	
	/* == USER DATA == */
	
		/* Stored data */
		data: { },
		
		/* Initialize the storage module */
		initStorage: function() {
			npu.loadData();
		},
		
		/* Load all data from local storage */
		loadData: function() {
			try {
				npu.data = JSON.parse(GM_getValue("data"));
			}
			catch(e) { }
			npu.upgradeSchema();
		},
		
		/* Save all data to local storage */
		saveData: function() {
			this.runAsync(function() {
				GM_setValue("data", JSON.stringify(npu.data));
			});
		},
		
		/* Gets the specified property or all data of the specified user or the current user */
		getUserData: function(domain, user, key) {
			domain = domain ? domain : npu.domain;
			user = user ? user : npu.user;
			key = Array.prototype.slice.call(arguments).slice(2);
			key = key.length == 1 && typeof key[0].length != "undefined" ? key[0] : key;
			return npu.getChild(npu.data, ["users", domain, user, "data"].concat(key));
		},
		
		/* Sets the specified property of the specified user or the current user */
		setUserData: function(domain, user, key, value) {
			domain = domain ? domain : npu.domain;
			user = user ? user : npu.user;
			key = Array.prototype.slice.call(arguments).slice(2, arguments.length - 1);
			key = key.length == 1 && typeof key[0].length != "undefined" ? key[0] : key;
			value = arguments.length > 4 ? arguments[arguments.length - 1] : value;
			npu.setChild(npu.data, ["users", domain, user, "data"].concat(key), value);
		},
		
		/* Upgrade the data schema to the latest version */
		upgradeSchema: function() {
			var ver = typeof npu.data.version != "undefined" ? npu.data.version : 0;
			
			/* < 1.3 */
			if(ver < 1) {
				try {
					var users = JSON.parse(GM_getValue("neptun.users"));
				}
				catch(e) { }
				if(users != null && typeof users.length != "undefined") {
					for(var i = 0; i < users.length; i++) {
						npu.setChild(npu.data, ["users", npu.domain, users[i][0].toUpperCase(), "password"], npu.encodeBase64(users[i][1]));
					}
				}
				try {
					var courses = JSON.parse(GM_getValue("neptun.courses"));
				}
				catch(e) { }
				if(typeof courses == "object") {
					for(var user in courses) {
						for(var subject in courses[user]) {
							npu.setUserData(null, user, ["courses", "_legacy", subject], courses[user][subject]);
						}
					}
				}
				npu.data.version = 1;
			}
			
			npu.saveData();
		},
	
	/* == LOGIN == */
	
		/* Returns users with stored credentials */
		getLoginUsers: function() {
			var users = [], list = npu.getChild(npu.data, ["users", npu.domain]);
			for(var user in list) {
				if(typeof list[user].password == "string" && list[user].password != "") {
					users.push(user);
				}
			}
			return users;
		},
	
		/* Load and display user select field */
		initUserSelect: function() {
			var users = npu.getLoginUsers();

			$(".login_left_side .login_input").css("text-align", "left");
			
			var selectField = $('<select id="user_sel" class="bevitelimezo" name="user_sel"></select>').hide();
			for(var i = 0; i < users.length; i++) {
				selectField.append('<option id="' + users[i] + '" value="' + users[i] + '" class="neptun_kod">' + users[i] + '</option>');
			}
			
			selectField.append('<option disabled="disabled" class="user_separator">&nbsp;</option>');

			selectField.append('<option id="other_user" value="__OTHER__">Más felhasználó...</option>');
			selectField.append('<option id="edit_list" value="__DELETE__">Tárolt kód törlése...</option>');
			
			$("td", selectField).css("position", "relative");
			selectField.css("font-weight", "bold").css("font-family", "consolas, courier new, courier, monospace").css("font-size", "1.5em");
			$("option[class!=neptun_kod]", selectField).css("font-size", "0.8em").css("font-family", "tahoma").css("font-weight", "normal").css("color", "#666").css("font-style", "italic");
			$("option.user_separator", selectField).css("font-size", "0.5em");
			
			selectField.bind("mousedown focus change", function() { npu.abortLogin() });
			$("#pwd, #Submit, #btnSubmit").bind("mousedown focus change", function() { npu.abortLogin() });
			
			selectField.bind("change", function() {
				npu.clearLogin();
				
				if($(this).val() == "__OTHER__") {
					npu.hideSelect();
					return false;
				}
				
				if($(this).val() == "__DELETE__") {
					$("#user_sel").val(users[0]).trigger("change");
					var defaultString = "mindegyiket";
					for(var i = 0; i < users.length; i++) {
						defaultString += "   /   " + users[i];
					}
					itemToDelete = unsafeWindow.prompt("Írd be a törlendo neptun kódot. Az összes törléséhez írd be: MINDEGYIKET", defaultString);
					if(itemToDelete == "" || itemToDelete == null) {
						return false;
					}
					
					var deleted = false;
					for(var i = 0; i < users.length; i++) {
						if(users[i] == itemToDelete.toUpperCase() || itemToDelete.toUpperCase() == "MINDEGYIKET") {
							npu.setChild(npu.data, ["users", npu.domain, users[i], "password"], null);
							deleted = true;
						}
					}
					
					if(!deleted) {
						if(confirm("A megadott neptun kód nincs benne a tárolt listában. Megpróbálod újra?")) {
							$("#user_sel").val("__DELETE__").trigger("change");
						}
						return false;
					}
					
					npu.saveData();
					
					if(itemToDelete.toUpperCase() == "MINDEGYIKET") {
						alert("Az összes tárolt neptun kód törölve lett a bejelentkezési listából.");
						window.location.reload();
						return false;
					}
					
					alert("A(z) " + itemToDelete + " felhasználó törölve lett a bejelentkezési listából.");
					window.location.reload();
					return false;
				}
				
				$("#user").val(users[$(this).get(0).selectedIndex]);
				$("#pwd").val(npu.decodeBase64(npu.getChild(npu.data, ["users", npu.domain, users[$(this).get(0).selectedIndex], "password"])));
			});
			
			$("input[type=button].login_button").attr("onclick", "").bind("click", function(e) {
				e.preventDefault();
				
				if($("#user_sel").val() == "__OTHER__") {
					if($("#user").val().trim() == "" || $("#pwd").val().trim() == "") {
						return;
					}
					
					var foundID = -1;
					for(var i = 0; i < users.length; i++) {
						if(users[i] == $("#user").val().toUpperCase()) {
							foundID = i;
						}
					}
					
					if(foundID == -1) {
						if(confirm("Szeretnéd menteni a beírt adatokat, hogy késobb egy kattintással be tudj lépni errol a számítógéprol?")) {
							npu.setChild(npu.data, ["users", npu.domain, $("#user").val().toUpperCase(), "password"], npu.encodeBase64($("#pwd").val()));
							npu.saveData();
						}
						npu.submitLogin();
						return;
					}
					else {
						$("#user_sel").val(users[foundID]);
					}
				}
				
				if($("#user_sel").val() == "__DELETE__") {
					return;
				}
				
				if($("#pwd").val() != npu.decodeBase64(npu.getChild(npu.data, ["users", npu.domain, users[$("#user_sel").get(0).selectedIndex], "password"]))) {
					if(confirm("Szeretnéd megváltoztatni a(z) " + $("#user").val().toUpperCase() + " felhasználó tárolt jelszavát a most beírt jelszóra?")) {
						npu.setChild(npu.data, ["users", npu.domain, users[$("#user_sel").get(0).selectedIndex], "password"], npu.encodeBase64($("#pwd").val()));
						npu.saveData();
					}
				}
				
				npu.submitLogin();
				return;
			});
			
			$("#user").parent().append(selectField);
			npu.showSelect();
			selectField.trigger("change");
		},
		
		/* Initialize auto login and start countdown */
		initAutoLogin: function() {
			var users = npu.getLoginUsers();
			
			if(users.length < 1) {
				return;
			}
			
			var submit = $("#Submit, #btnSubmit");
			
			npu.loginCount = 3;
			npu.loginButton = submit.attr("value");
			submit.attr("value", npu.loginButton + " (" + npu.loginCount + ")");
			
			$(".login_button_td").append('<div id="abortLogin" style="text-align: center; margin: 23px 0 0 128px"><a href="#" class="abort_login">Megszakít</a></div>');
			$(".login_button_td a.abort_login").click(function(e) {
				e.preventDefault();
				npu.abortLogin();
			});
			
			npu.loginTimer = window.setInterval(function() {
				npu.loginCount--;
				submit.attr("value", npu.loginButton + " (" + npu.loginCount + ")");
				
				if(npu.loginCount <= 0) {
					npu.submitLogin();
					npu.abortLogin();
					submit.attr("value", npu.loginButton + "...");
				}
			}, 1000);
		},
		
		/* Abort the auto login countdown */
		abortLogin: function() {
			window.clearInterval(npu.loginTimer);
			$("#Submit, #btnSubmit").attr("value", npu.loginButton);
			$("#abortLogin").remove();
		},
		
		/* Clears the login form */
		clearLogin: function() {
			$("#user").val("");
			$("#pwd").val("");
		},
		
		/* Display user select field */
		showSelect: function() {
			$("#user").hide();
			$("#user_sel").show().focus();
			npu.runEval(' Page_Validators[0].controltovalidate = "user_sel" ');
		},
		
		/* Hide user select field and display original textbox */
		hideSelect: function() {
			$("#user_sel").hide();
			$("#user").show().focus();
			npu.runEval(' Page_Validators[0].controltovalidate = "user" ');
		},
		
		/* Submit the login form */
		submitLogin: function() {
			unsafeWindow.docheck();
		},
		
		/* Reconfigure server full wait dialog parameters */
		fixWaitDialog: function() {
			unsafeWindow.maxtrynumber = 1e6;
			unsafeWindow.starttimer = function() {
				unsafeWindow.login_wait_timer = setInterval("docheck()", 5000);
			}
		},
		
	/* == MAIN == */
	
		/* Hide page header to save vertical space */
		hideHeader: function() {
			$("#panHeader, #panCloseHeader").hide();
			$("table.top_menu_wrapper").css("margin-top", "5px").css("margin-bottom", "8px");
			$("#form1 > fieldset").css("border", "0 none");
		},
		
		/* Add current page name to the window title */
		fixTitle: function() {
			var originalTitle = document.title;
			window.setInterval(function() {
				var pageTitle = $("#menucaption").text().toString();
				document.title =  (pageTitle == "" ? "" : pageTitle + " - ") + originalTitle;
			}, 1000);
		},
		
		/* Fix opening in new tab and add shortcuts */
		fixMenu: function() {
			var color = $("#lbtnQuit").css("color");
			$('<style type="text/css">ul.menubar, .top_menu_wrapper { cursor: default !important } #mb1 li.menu-parent { color: #525659 !important } #mb1 li.menu-parent.has-target { color: ' + color + ' !important } #mb1 li.menu-parent.has-target:hover { color: #000 !important }</style>').appendTo("head");
			$("#mb1_Tanulmanyok").attr("targeturl", "main.aspx?ctrl=0206&ismenuclick=true").attr("hoverid", "#mb1_Tanulmanyok_Leckekonyv");
			$("#mb1_Targyak").attr("targeturl", "main.aspx?ctrl=0303&ismenuclick=true").attr("hoverid", "#mb1_Targyak_Targyfelvetel");
			$("#mb1_Vizsgak").attr("targeturl", "main.aspx?ctrl=0401&ismenuclick=true").attr("hoverid", "#mb1_Vizsgak_Vizsgajelentkezes");
			var orarend = $('<li aria-haspopup="false" tabindex="0" role="menuitem" class="menu-parent has-target" id="mb1_Orarend" targeturl="main.aspx?ctrl=0203&amp;ismenuclick=true">Órarend</li>');
			$("#mb1_Targyak").before(orarend);
			$("#mb1_Tanulmanyok_Órarend").remove();
			$("#Menu_neptun_neptun li[targeturl]").css("position", "relative").each(function() {
				$(this).addClass("has-target");
				var a = $('<a href="' + $(this).attr("targeturl") + '" style="display: block; position: absolute; left: 0; top: 0; width: 100%; height: 100%"></a>');
				a.click(function(e) {
					$("ul.menu").css("visibility", "hidden");
					document.location = $(this).attr("href");
					e.preventDefault();
				});
				var hoverid = $(this).attr("hoverid");
				if(hoverid) {
					a.hover(function() { $(hoverid).addClass("menu-hover"); }, function() { $(hoverid).removeClass("menu-hover"); });
				}
				$(this).append(a);
			});
		},
		
		/* Replace term drop-down list with buttons */
		fixTermSelect: function() {
			$('<style type="text/css"> .termSelect { list-style: none; padding: 0; } .termSelect li { display: inline-block; *display: inline; vertical-align: middle; margin: 0 15px 0 0; line-height: 250%; } .termSelect li a { padding: 5px; } .termSelect li a.button { color: #FFF; box-shadow: none; text-decoration: none; cursor: default; } </style>').appendTo("head");
			
			var findTermSelect = function() {
				return $("#upFilter_cmbTerms, #upFilter_cmb_m_cmb, #cmbTermsNormal, #upFilter_cmbTerms_m_cmb, #cmb_cmb, #c_common_timetable_cmbTermsNormal, #cmbTerms_cmb").first();
			};
			var clickExecuteButton = function() {
				if(["0303", "h_addsubjects", "0401", "h_exams", "0503", "h_transactionlist"].indexOf(npu.getPage()) != -1) {
					return;
				}
				npu.runEval(function() {
					$("#upFilter_expandedsearchbutton").click();
				});
			};
			var selectTerm = function(term) {
				var termSelect = findTermSelect(), el = $(".termSelect a[data-value=" + term + "]");
				if(el.size() == 0 || el.hasClass("button")) {
					return false;
				}
				termSelect.val(el.attr("data-value"));
				$(".termSelect .button").removeClass("button");
				el.addClass("button");
				var onChange = termSelect[0].getAttributeNode("onchange");
				if(onChange) {
					npu.runAsync(function() { npu.runEval(onChange.value); });
				}
				return true;
			};
			
			window.setInterval(function() {
				var termSelect = findTermSelect();
				if(termSelect.is(":disabled")) {
					return;
				}
				if(termSelect.is(":visible")) {
					$(".termSelect").remove();
					var select = $('<ul class="termSelect"></ul>');
					var stored = npu.getUserData(null, null, ["termSelect", npu.getPage()]);
					var found = false;
					$("option", termSelect).each(function() {
						if($(this).attr("value") == "-1") { return; }
						var item = $('<li><a href="#" data-value="' + $(this).attr("value") + '" class="' + (termSelect.val() == $(this).attr("value") ? "button" : "") + '">' + $(this).html() + "</a></li>");
						if(typeof stored != "undefined" && $(this).attr("value") == stored) {
							found = true;
						}
						$("a", item).bind("click", function(e) {
							e.preventDefault();
							var term = $(this).attr("data-value");
							if(selectTerm(term)) {
								if(stored != term) {
									stored = term;
									npu.setUserData(null, null, ["termSelect", npu.getPage()], term);
									npu.saveData();
								}
								clickExecuteButton();
							}
						});
						select.append(item);
					});
					termSelect.parent().append(select);
					termSelect.hide();
					if(!termSelect.data("initialized")) {
						termSelect.data("initialized", true);
						if(found && termSelect.val() != stored) {
							selectTerm(stored);
							clickExecuteButton();
						}
						else if($(".grid_pagertable").size() == 0) {
							clickExecuteButton();
						}
					}
				}
			}, 500);
		},
		
		/* Set all paginators to 500 items per page */
		fixPagination: function() {
			window.setInterval(function() {
				var pageSelect = $(".grid_pagerpanel select");
				pageSelect.each(function() {
					var e = $(this);
					e.hide();
					$(".link_pagesize", e.closest("tr")).html("");
					if(e.attr("data-listing") != "1" && e.val() != "500") {
						e.attr("data-listing", "1").val("500");
						var onChange = this.getAttributeNode("onchange");
						if(onChange) {
							npu.runEval(onChange.value);
						}
					}
				});
			}, 100);
		},
		
		/* Hide countdown and send requests to the server to keep the session alive */
		initKeepSession: function() {
			var cdt = $("#hfCountDownTime");
			var timeout = 120;
			if(cdt.size() > 0) {
				var cdto = parseInt(cdt.val());
				if(cdto > 60) {
					timeout = cdto;
				}
			}
			var keepAlive = function() {
				window.setTimeout(function() {
					$.ajax({
						url: "main.aspx"
					});
					keepAlive();
				}, timeout * 1000 - 30000 - Math.floor(Math.random() * 30000));
			};
			keepAlive();
			
			window.setInterval(function() {
				npu.runEval(function() {
					ShowModal = function() { };
					clearTimeout(timerID);
					clearTimeout(timerID2);
					sessionEndDate = null;
				});
				if($("#npuStatus").size() == 0) {
					$("#upTraining_lblRemainingTime").html('<span id="npuStatus" style="font-weight: normal"><a href="https://npu.herokuapp.com" target="_blank">Neptun PowerUp!</a> v' + GM_info["script"]["version"] + '</span>');
				}
			}, 1000);
		},
		
		/* Use custom loading indicator for async requests */
		initProgressIndicator: function() {
			var color = $("#lbtnQuit").css("color");
			$('<style type="text/css"> #npu_loading { position: fixed; width: 150px; margin-left: -75px; left: 50%; top: 0; background: ' + color + '; color: white; font-size: 1em; font-size: 1.2em; font-weight: bold; padding: 8px 10px; text-align: center; z-index: 1000; display: none; -webkit-border-bottom-right-radius: 5px; -webkit-border-bottom-left-radius: 5px; -moz-border-radius-bottomright: 5px; -moz-border-radius-bottomleft: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; -webkit-box-shadow: 0px 0px 3px 0px black; -moz-box-shadow: 0px 0px 3px 0px black; box-shadow: 0px 0px 3px 0px black; } </style>').appendTo("head");
			$("#progress, #customtextprogress").css("visibility", "hidden");
			$('<div id="npu_loading">Kis türelmet...</div>').appendTo("body");
			
			npu.runEval(function() {
				var manager = Sys.WebForms.PageRequestManager.getInstance();
				manager.add_beginRequest(function(a, b) {
					$("#npu_loading").show();
				});
				manager.add_endRequest(function() {
					$("#npu_loading").hide();
				});
			});
		},
		
	/* == TIMETABLE == */
	
		/* Enhance timetable functionality */
		fixTimetable: function() {
			window.setInterval(function() {
				if($("#gridcontainer").attr("data-bound") != "1") {
					npu.runEval(function() {
						var options = $("#gridcontainer").BcalGetOp();
						if(typeof options != "undefined" && options != null) {
							$("#gridcontainer").attr("data-bound", "1");
							var callback = options.onAfterRequestData;
							options.onAfterRequestData = function(n) {
								if($("#gridcontainer").attr("data-called") != "1") {
									$("#gridcontainer").attr("data-called", "1");
									$("#upFunction_c_common_timetable_upTimeTable .showtoday").trigger("click");
								}
								callback(n);
							}
						}
					});
				}
			}, 100);
		},
		
	/* == MARK LIST == */
	
		/* Enhance mark list style */
		fixMarkList: function() {
			$('<style type="text/css"> #h_markbook_gridIndexEntry_bodytable tr.SubjectCompletedRow td { background-color: #D5EFBA !important; } </style>').appendTo("head");
		},

	/* == PROGRESS LIST == */
		
		/* Enhance progress list style */
		fixProgressList: function() {
			$('<style type="text/css"> #h_advance_gridSubjects_bodytable tr:not(.gridrow_blue):not(.gridrow_green) td, #h_advance_NonCurrTemp_bodytable tr:not(.gridrow_blue):not(.gridrow_green) td { background-color: #F8EFB1 !important; font-weight: bold; color: #525659; } #h_advance_gridSubjects_bodytable tr.gridrow_green td, #h_advance_NonCurrTemp_bodytable tr.gridrow_green td { background-color: #D5EFBA !important; font-weight: bold; color: #525659; } #h_advance_gridSubjects_bodytable tr.gridrow_blue td, #h_advance_NonCurrTemp_bodytable tr.gridrow_blue td { background-color: none !important; color: #525659; } </style>').appendTo("head");
		},
		
	/* == COURSE LIST == */
		
		/* Enhance course list style and functionality */
		fixCourseList: function() {
			$('<style type="text/css"> #h_addsubjects_gridSubjects_bodytable tr.Row1_Bold td, #Addsubject_course1_gridCourses_bodytable tr.Row1_sel td, #Addsubject_course1_gridCourses_bodytable tr.Row1_Bold_sel td, #h_addsubjects_gridSubjects_bodytable tr.context_selectedrow td { background-color: #F8EFB1 !important; font-weight: bold; color: #525659; } #h_addsubjects_gridSubjects_bodytable tr, #Addsubject_course1_gridCourses_bodytable tr { cursor: pointer; } #h_addsubjects_gridSubjects_bodytable tr.npu_completed td, #h_addsubjects_gridSubjects_bodytable tr.context_selectedrow[data-completed] td { background-color: #D5EFBA !important; font-weight: bold; color: #525659; } #h_addsubjects_gridSubjects_bodytable tr.context_selectedrow { border: 0 none !important; border-bottom: 1px solid #D3D3D3 !important; } </style>').appendTo("head");
			
			$("body").on("click", "#Addsubject_course1_gridCourses_bodytable tbody td", function(e) {
				if($(e.target).closest("input[type=checkbox]").size() == 0 && $(e.target).closest("td[onclick]").size() == 0) {
					var checkbox = $("input[type=checkbox]", $(this).closest("tr")).get(0);
					checkbox.checked = !checkbox.checked;
					var obj = unsafeWindow[$("#Addsubject_course1_gridCourses_gridmaindiv").attr("instanceid")];
					try { obj.Cv($("input[type=checkbox]", $(this).closest("tr")).get(0), "1"); } catch(ex) { }
					e.preventDefault();
					return false;
				}
			});
			
			$("body").on("click", "#h_addsubjects_gridSubjects_bodytable tbody td", function(e) {
				if($(e.target).closest("td[onclick], span.link").size() == 0 && $(e.target).closest("td.contextcell_sel, td.contextcell").size() == 0) {
					npu.runEval($("td[onmousemove] span.link", $(this).closest("tr")).attr("onclick"));
					e.preventDefault();
					return false;
				}
			});
			
			window.setInterval(function() {
				var table = $("#h_addsubjects_gridSubjects_bodytable");
				if(table.attr("data-painted") != "1") {
					table.attr("data-painted", "1");
					$("tbody tr", table).each(function() {
						if($('td[n="Completed"] img', this).size() != 0) {
							$(this).addClass("npu_completed").attr("data-completed", "1");
						}
					});
				}
			}, 250);
		},
		
		/* Automatically press submit button on course list page */
		initCourseAutoList: function() {
			npu.runEval(function() {
				var manager = Sys.WebForms.PageRequestManager.getInstance();
				var courseListLoading = false;
				manager.add_beginRequest(function() {
					courseListLoading = true;
				});
				manager.add_endRequest(function() {
					courseListLoading = false;
				});
				window.setInterval(function() {
					if(!courseListLoading && $("#h_addsubjects_gridSubjects_gridmaindiv").size() == 0) {
						$("#upFilter_expandedsearchbutton").click();
					}
				}, 250);
			});
			
			$("body").on("change", "#upFilter_chkFilterCourses", function() {
				$("#upFunction_h_addsubjects_upGrid").html("");
			});
		},
		
		/* Initialize course choice storage and mark subject and course lines with stored course choices */
		initCourseStore: function() {
			$('<style type="text/css"> #h_addsubjects_gridSubjects_bodytable tr td.npu_choice_mark, #Addsubject_course1_gridCourses_bodytable  tr td.npu_choice_mark { background: #C00 !important } </style>').appendTo("head");
			
			var loadCourses = function() {
				courses = { };
				$.extend(courses, npu.getUserData(null, null, ["courses", "_legacy"]));
				$.extend(courses, npu.getUserData(null, null, ["courses", npu.training]));
			};
			
			var refreshScreen = function() {
				$("#h_addsubjects_gridSubjects_bodytable").attr("data-choices-displayed", "0");
				$("#Addsubject_course1_gridCourses_bodytable").attr("data-inner-choices-displayed", "0");
			};
			
			var courses = null;
			loadCourses();
			
			window.setInterval(function() {
				var table = $("#h_addsubjects_gridSubjects_bodytable");
				if(table.size() > 0 && table.attr("data-choices-displayed") != "1") {
					table.attr("data-choices-displayed", "1");
					var filterEnabled = npu.getUserData(null, null, "filterCourses");
					$("tbody tr", table).each(function() {
						var subjectCode = $("td:nth-child(3)", this).text().trim().toUpperCase();
						var choices = courses[subjectCode.trim().toUpperCase()];
						if(typeof choices != "undefined" && choices != null && choices.length > 0) {
							$("td:first-child", this).addClass("npu_choice_mark");
							$(this).css("display", "table-row");
						}
						else {
							$("td:first-child", this).removeClass("npu_choice_mark");
							$(this).css("display", filterEnabled ? "none" : "table-row");
						}
					});
					
					var pager = $("#h_addsubjects_gridSubjects_gridmaindiv .grid_pagertable .grid_pagerpanel table tr");
					if($("#npu_clear_courses").size() == 0) {
						var clearAll = $('<td id="npu_clear_courses"><a style="color: #C00; line-height: 17px; margin-right: 30px" href="">Tárolt kurzusok törlése</a></td>');
						$("a", clearAll).click(function(e) {
							e.preventDefault();
							if(confirm(npu.user + " felhasználó összes tárolt kurzusa törölve lesz ezen a képzésen. Valóban ezt szeretnéd?")) {
								npu.setUserData(null, null, ["courses", npu.training], { });
								npu.setUserData(null, null, ["courses", "_legacy"], { });
								npu.setUserData(null, null, "filterCourses", false);
								npu.saveData();
								loadCourses();
								refreshScreen();
							}
						});
						pager.prepend(clearAll);
					}
					if($("#npu_filter_courses").size() == 0) {
						var filterCell = $('<td id="npu_filter_courses" style="padding-right: 30px; line-height: 17px"><input type="checkbox" id="npu_filter_field" style="vertical-align: middle" />&nbsp;&nbsp;<label for="npu_filter_field">Csak a tárolt kurzusok megjelenítése</label></td>');
						$("input", filterCell).change(function(e) {
							npu.setUserData(null, null, "filterCourses", $(this).get(0).checked);
							npu.saveData();
							refreshScreen();
						});
						pager.prepend(filterCell);
					}
					$("#npu_filter_field").get(0).checked = filterEnabled;
				}
				
				var innerTable = $("#Addsubject_course1_gridCourses_bodytable");
				if(innerTable.size() > 0 && innerTable.attr("data-inner-choices-displayed") != "1") {
					innerTable.attr("data-inner-choices-displayed", "1");
					if($("th.headerWithCheckbox", innerTable).size() == 0) {
						var objName = $("#Addsubject_course1_gridCourses_gridmaindiv").attr("instanceid");
						$('<th id="head_chk" class="headerWithCheckbox headerDisabled" colname="chk" title="Válasszon ki legalább egyet!" align="center"><label class="hiddenforlabel" for="Addsubject_course1_gridCourses_bodytable_chk_chkall">Összes kijelölése</label><span></span><input aria-disabled="false" role="checkbox" id="Addsubject_course1_gridCourses_bodytable_chk_chkall" onclick="' + objName + '.AllCheckBox(this.checked,\'chk\',true,1,this)" type="checkbox"><span></span></th>').appendTo("#Addsubject_course1_gridCourses_headerrow");
						$("tbody tr", innerTable).each(function() {
							$('<td t="chks" n="chk" class="aligncenter"><label class="hiddenforlabel" for="chk' + $(this).attr("id").substring(4) + '">' + $("td:nth-child(2)", this).text().trim() + '</label><input id="chk' + $(this).attr("id").substring(4) + '" aria-disabled="false" role="checkbox" onclick="' + objName + '.Cv(this,\'1\');" type="checkbox"></td>').appendTo(this);
						});
					}
					$("tbody tr", innerTable).each(function() {
						$("input[type=checkbox]", this).removeAttr("disabled");
					});
					var subjectText = $("#upFunction_h_addsubjects_upModal_upmodal_subjectdata_ctl02_Subject_data1_upParent_tab_ctl00_upAddSubjects .subtitle_table h2").html();
					if(subjectText != null) {
						var subjectCode = subjectText.match(/^.*?\((.*)\)<br>.*$/)[1];
						if(typeof subjectCode != "undefined") {
							var choices = courses[subjectCode.trim().toUpperCase()];
							var hasChoices = (typeof choices != "undefined" && choices != null && choices.length > 0);
							if(hasChoices) {
								$("tbody tr", innerTable).each(function() {
									var courseCode = $("td:nth-child(2)", this).text().trim().toUpperCase();
									if($.inArray(courseCode, choices) != -1) {
										$("td:first-child", this).addClass("npu_choice_mark");
									}
									else {
										$("td:first-child", this).removeClass("npu_choice_mark");
									}
								});
							}
							else {
								$("tbody tr td:first-child", innerTable).removeClass("npu_choice_mark");
							}
							if($(".npu_course_choice_actions").size() == 0) {
								var header = $("#Addsubject_course1_gridCourses_gridmaindiv .grid_functiontable_top .functionitem");
								var footer = $("#Addsubject_course1_gridCourses_tablebottom .grid_functiontable_bottom .functionitem");
								var canSave = header.size() > 0;
								if(header.size() == 0) {
									$('<table class="grid_functiontable_top" align="left"><tbody><tr><td class="functionitem" nowrap=""></td></tr></tbody></table>').appendTo("#Addsubject_course1_gridCourses_gridmaindiv .grid_topfunctionpanel");
									header = $(header.selector);
								}
								if(footer.size() == 0) {
									$('<table class="grid_functiontable_bottom" align="right"><tbody><tr><td class="functionitem" nowrap=""></td></tr></tbody></table>').appendTo("#Addsubject_course1_gridCourses_tablebottom .grid_bottomfunctionpanel");
									footer = $(footer.selector);
								}
								var buttonBarExtensions = $('<span class="npu_course_choice_actions" style="margin: 0 20px"><span class="FunctionCommandTitle">Tárolt kurzusok:</span><input type="button" value="Tárolás" class="gridbutton npu_course_choice_save"><input type="button" value="Betöltés" class="gridbutton npu_course_choice_load" style="display: none">' + (canSave ? '<input type="button" value="Betöltés és Mentés" class="gridbutton npu_course_choice_apply" style="display: none">' : "") + '<input type="button" value="Törlés" class="gridbutton npu_course_choice_delete" style="display: none"></span>');
								header.append(buttonBarExtensions);
								footer.prepend(buttonBarExtensions.clone());
								$(".npu_course_choice_actions .npu_course_choice_save").click(function() {
									var selectedCourses = [];
									$("tbody tr", innerTable).each(function() {
										var courseCode = $("td:nth-child(2)", this).text().trim().toUpperCase();
										var checkbox = $("input[type=checkbox]", this).get(0);
										if(checkbox.checked) {
											selectedCourses.push(courseCode);
										}
									});
									if(selectedCourses.length == 0) {
										alert("A tároláshoz elobb válaszd ki a tárolandó kurzusokat.");
									}
									else {
										npu.setUserData(null, null, ["courses", npu.training, subjectCode.trim().toUpperCase()], selectedCourses);
										npu.saveData();
										loadCourses();
										refreshScreen();
									}
								});
								$(".npu_course_choice_actions .npu_course_choice_load").click(function() {
									$("tbody tr", innerTable).each(function() {
										var courseCode = $("td:nth-child(2)", this).text().trim().toUpperCase();
										var checkbox = $("input[type=checkbox]", this).get(0);
										checkbox.checked = $.inArray(courseCode, courses[subjectCode.trim().toUpperCase()]) != -1;
										var obj = unsafeWindow[$("#Addsubject_course1_gridCourses_gridmaindiv").attr("instanceid")];
										try { obj.Cv(checkbox, "1"); } catch(ex) { }
									});
								});
								$(".npu_course_choice_actions .npu_course_choice_apply").click(function() {
									npu.runEval(function() {
										$(".npu_course_choice_actions .npu_course_choice_load").trigger("click");
									});
									var obj = unsafeWindow[$("#Addsubject_course1_gridCourses_gridmaindiv").attr("instanceid")];
									try { obj.SelectFunction("update"); } catch(ex) { }
								});
								$(".npu_course_choice_actions .npu_course_choice_delete").click(function() {
									if(confirm("Valóban törölni szeretnéd a tárolt kurzusokat?")) {
										npu.setUserData(null, null, ["courses", npu.training, subjectCode.trim().toUpperCase()], null);
										npu.setUserData(null, null, ["courses", "_legacy", subjectCode.trim().toUpperCase()], null);
										npu.saveData();
										loadCourses();
										refreshScreen();
									}
								});
							}
							$(".npu_course_choice_load, .npu_course_choice_apply, .npu_course_choice_delete", $(".npu_course_choice_actions")).css("display", hasChoices ? "inline" : "none");
						}
					}
				}
			}, 500);
		},
		
	/* == EXAM LIST == */
	
		/* Enhance exam list style and functionality */
		fixExamList: function() {
			$('<style type="text/css"> #h_exams_gridExamList_bodytable tr.gridrow_blue td { background: #F8EFB1 !important; font-weight: bold; color: #525659 !important; } #h_exams_gridExamList_bodytable tr { cursor: pointer; } </style>').appendTo("head");
			$("body").on("click", "#h_exams_gridExamList_bodytable tbody td", function(e) {
				if($(e.target).closest("td[onclick], td.contextcell_sel, td.contextcell").size() == 0) {
					npu.runEval(function() {
						$("td.contextcell, td.contextcell_sel", $(this).closest("tr")).trigger("click");
					});
					e.preventDefault();
					return false;
				}
			});
		},
		
		/* Automatically list exams on page load and subject change */
		initExamAutoList: function() {
			$('<style type="text/css"> #upFilter_bodytable tr.nostyle { display: none } </style>').appendTo("head");
			$("body").on("change", "#upFilter_cmbSubjects", function() {
				$.examListSubjectValue = $(this).val();
			});
			window.setInterval(function() {
				var panel = $("#upFilter_panFilter table.searchpanel");
				if(panel.attr("data-listing") != "1" && ($.examListTerm != $("#upFilter_cmbTerms option[selected]").attr("value") || $.examListSubject != $.examListSubjectValue)) {
					panel.attr("data-listing", "1");
					$.examListTerm = $("#upFilter_cmbTerms option[selected]").attr("value");
					$.examListSubject = $.examListSubjectValue;
					npu.runEval(function() {
						$("#upFilter_expandedsearchbutton").click();
					});
				}
			}, 100);
		},
	
	/* == STATISTICS == */
	
		/* Statistics server URL */
		statHost: "http://npu.herokuapp.com/stat",
		
		/* Initialize statistics */
		initStat: function() {
			var code = npu.getUserData(null, null, ["statCode"]);
			if(code == null) {
				code = npu.generateToken();
				npu.setUserData(null, null, ["statSalt"], null);
				npu.setUserData(null, null, ["statCode"], code);
				npu.saveData();
			}
			setTimeout(function() {
				try {
					var h = new npu.jsSHA(npu.user + ":" + code, "TEXT").getHash("SHA-256", "HEX");
					GM_xmlhttpRequest({
						method: "POST",
						data: $.param({
							version: GM_info["script"]["version"],
							domain: npu.domain,
							user: h.substring(0, 32),
							uri: window.location.href
						}),
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						synchronous: false,
						timeout: 10000,
						url: npu.statHost
					});
				}
				catch(e) { }
			}, 5000);
		},
	
	/* == MISC == */
	
		/* Initialize and cache parameters that do not change dynamically */
		initParameters: function() {
			npu.user = npu.getUser();
			npu.domain = npu.getDomain();
			npu.training = npu.getTraining();
		},
	
		/* Parses and returns the first-level domain of the site */
		getDomain: function() {
			var domain = "", host = location.host.split(".");
			var tlds = ["at", "co", "com", "edu", "eu", "gov", "hu", "hr", "info", "int", "mil", "net", "org", "ro", "rs", "sk", "si", "ua", "uk"];
			for(var i = host.length - 1; i >= 0; i--) {
				domain = host[i] + "." + domain;
				if($.inArray(host[i], tlds) == -1) {
					return domain.substring(0, domain.length - 1);
				}
			}
		},
		
		/* Parses and returns the ID of the current user */
		getUser: function() {
			if($("#upTraining_topname").size() > 0) {
				var input = $("#upTraining_topname").text();
				return input.substring(input.indexOf(" - ") + 3).toUpperCase();
			}
		},
		
		/* Parses and returns the sanitized name of the current training */
		getTraining: function() {
			if($("#lblTrainingName").size() > 0) {
				return $("#lblTrainingName").text().replace(/[^a-zA-Z0-9]/g, "");
			}
		},
		
		/* Returns whether we are on the login page */
		isLogin: function() {
			return $("td.login_left_side").size() > 0;
		},
		
		/* Returns the ID of the current page */
		getPage: function() {
			var result = (/ctrl=([a-zA-Z0-9_]+)/g).exec(window.location.href);
			return result ? result[1] : null;
		},
		
		/* Returns whether the specified ID is the current page */
		isPage: function(ctrl) {
			return (window.location.href.indexOf("ctrl=" + ctrl) != -1);
		},
		
		/* Runs a function asynchronously to fix problems in certain cases */
		runAsync: function(func) {
			window.setTimeout(func, 0);
		},
		
		/* Evaluates code in the page context */
		runEval: function(source) {
			if ("function" == typeof source) {
				source = "(" + source + ")();"
			}
			var script = document.createElement('script');
			script.setAttribute("type", "application/javascript");
			script.textContent = source;
			document.body.appendChild(script);
			document.body.removeChild(script);
		},
		
		/* Returns the child object at the provided path */
		getChild: function(o, s) {
			while(s.length) {
				var n = s.shift();
				if(!(o instanceof Object && n in o)) {
					return;
				}
				o = o[n];
			}
			return o;
		},
		
		/* Set the child object at the provided path */
		setChild: function(o, s, v) {
			while(s.length) {
				var n = s.shift();
				if(s.length == 0) {
					if(v == null) {
						delete o[n];
					}
					else {
						o[n] = v;
					}
					return;
				}
				if(!(typeof o == "object" && n in o)) {
					o[n] = new Object();
				}
				o = o[n];
			}
		},
		
		/* Generates a random token */
		generateToken: function() {
			var text = "", possible = "0123456789abcdef";
			for(var i = 0; i < 32; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			return text;
		},
		
		/* Encodes a string into base64 */
		encodeBase64: function(data) {
			var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = "", tmp_arr = [];
			if(!data) {
				return data;
			}
			do {
				o1 = data.charCodeAt(i++); o2 = data.charCodeAt(i++); o3 = data.charCodeAt(i++);
				bits = o1 << 16 | o2 << 8 | o3;
				h1 = bits >> 18 & 0x3f; h2 = bits >> 12 & 0x3f; h3 = bits >> 6 & 0x3f; h4 = bits & 0x3f;
				tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
			} while(i < data.length);
			enc = tmp_arr.join("");
			var r = data.length % 3;
			return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
		},
		
		/* Decodes a string from base64 */
		decodeBase64: function(data) {
			var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = "", tmp_arr = [];
			if (!data) {
				return data;
			}
			data += "";
			do {
				h1 = b64.indexOf(data.charAt(i++)); h2 = b64.indexOf(data.charAt(i++)); h3 = b64.indexOf(data.charAt(i++)); h4 = b64.indexOf(data.charAt(i++));
				bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
				o1 = bits >> 16 & 0xff; o2 = bits >> 8 & 0xff; o3 = bits & 0xff;
				tmp_arr[ac++] = (h3 == 64 ? String.fromCharCode(o1) : (h4 == 64 ? String.fromCharCode(o1, o2) : String.fromCharCode(o1, o2, o3)));
			} while(i < data.length);
			dec = tmp_arr.join("");
			return dec;
		},
};

/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-2 as well as the corresponding HMAC implementation
 as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2013
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
(function(B){function r(a,c,b){var f=0,e=[0],g="",h=null,g=b||"UTF8";if("UTF8"!==g&&"UTF16"!==g)throw"encoding must be UTF8 or UTF16";if("HEX"===c){if(0!==a.length%2)throw"srcString of HEX type must be in byte increments";h=u(a);f=h.binLen;e=h.value}else if("ASCII"===c||"TEXT"===c)h=v(a,g),f=h.binLen,e=h.value;else if("B64"===c)h=w(a),f=h.binLen,e=h.value;else throw"inputFormat must be HEX, TEXT, ASCII, or B64";this.getHash=function(a,c,b,g){var h=null,d=e.slice(),l=f,m;3===arguments.length?"number"!==
typeof b&&(g=b,b=1):2===arguments.length&&(b=1);if(b!==parseInt(b,10)||1>b)throw"numRounds must a integer >= 1";switch(c){case "HEX":h=x;break;case "B64":h=y;break;default:throw"format must be HEX or B64";}if("SHA-224"===a)for(m=0;m<b;m++)d=q(d,l,a),l=224;else if("SHA-256"===a)for(m=0;m<b;m++)d=q(d,l,a),l=256;else throw"Chosen SHA variant is not supported";return h(d,z(g))};this.getHMAC=function(a,b,c,h,k){var d,l,m,n,A=[],s=[];d=null;switch(h){case "HEX":h=x;break;case "B64":h=y;break;default:throw"outputFormat must be HEX or B64";
}if("SHA-224"===c)l=64,n=224;else if("SHA-256"===c)l=64,n=256;else throw"Chosen SHA variant is not supported";if("HEX"===b)d=u(a),m=d.binLen,d=d.value;else if("ASCII"===b||"TEXT"===b)d=v(a,g),m=d.binLen,d=d.value;else if("B64"===b)d=w(a),m=d.binLen,d=d.value;else throw"inputFormat must be HEX, TEXT, ASCII, or B64";a=8*l;b=l/4-1;l<m/8?(d=q(d,m,c),d[b]&=4294967040):l>m/8&&(d[b]&=4294967040);for(l=0;l<=b;l+=1)A[l]=d[l]^909522486,s[l]=d[l]^1549556828;c=q(s.concat(q(A.concat(e),a+f,c)),a+n,c);return h(c,
z(k))}}function v(a,c){var b=[],f,e=[],g=0,h;if("UTF8"===c)for(h=0;h<a.length;h+=1)for(f=a.charCodeAt(h),e=[],2048<f?(e[0]=224|(f&61440)>>>12,e[1]=128|(f&4032)>>>6,e[2]=128|f&63):128<f?(e[0]=192|(f&1984)>>>6,e[1]=128|f&63):e[0]=f,f=0;f<e.length;f+=1)b[g>>>2]|=e[f]<<24-g%4*8,g+=1;else if("UTF16"===c)for(h=0;h<a.length;h+=1)b[g>>>2]|=a.charCodeAt(h)<<16-g%4*8,g+=2;return{value:b,binLen:8*g}}function u(a){var c=[],b=a.length,f,e;if(0!==b%2)throw"String of HEX type must be in byte increments";for(f=0;f<
b;f+=2){e=parseInt(a.substr(f,2),16);if(isNaN(e))throw"String of HEX type contains invalid characters";c[f>>>3]|=e<<24-f%8*4}return{value:c,binLen:4*b}}function w(a){var c=[],b=0,f,e,g,h,k;if(-1===a.search(/^[a-zA-Z0-9=+\/]+$/))throw"Invalid character in base-64 string";f=a.indexOf("=");a=a.replace(/\=/g,"");if(-1!==f&&f<a.length)throw"Invalid '=' found in base-64 string";for(e=0;e<a.length;e+=4){k=a.substr(e,4);for(g=h=0;g<k.length;g+=1)f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(k[g]),
h|=f<<18-6*g;for(g=0;g<k.length-1;g+=1)c[b>>2]|=(h>>>16-8*g&255)<<24-b%4*8,b+=1}return{value:c,binLen:8*b}}function x(a,c){var b="",f=4*a.length,e,g;for(e=0;e<f;e+=1)g=a[e>>>2]>>>8*(3-e%4),b+="0123456789abcdef".charAt(g>>>4&15)+"0123456789abcdef".charAt(g&15);return c.outputUpper?b.toUpperCase():b}function y(a,c){var b="",f=4*a.length,e,g,h;for(e=0;e<f;e+=3)for(h=(a[e>>>2]>>>8*(3-e%4)&255)<<16|(a[e+1>>>2]>>>8*(3-(e+1)%4)&255)<<8|a[e+2>>>2]>>>8*(3-(e+2)%4)&255,g=0;4>g;g+=1)b=8*e+6*g<=32*a.length?b+
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h>>>6*(3-g)&63):b+c.b64Pad;return b}function z(a){var c={outputUpper:!1,b64Pad:"="};try{a.hasOwnProperty("outputUpper")&&(c.outputUpper=a.outputUpper),a.hasOwnProperty("b64Pad")&&(c.b64Pad=a.b64Pad)}catch(b){}if("boolean"!==typeof c.outputUpper)throw"Invalid outputUpper formatting option";if("string"!==typeof c.b64Pad)throw"Invalid b64Pad formatting option";return c}function k(a,c){return a>>>c|a<<32-c}function I(a,c,b){return a&
c^~a&b}function J(a,c,b){return a&c^a&b^c&b}function K(a){return k(a,2)^k(a,13)^k(a,22)}function L(a){return k(a,6)^k(a,11)^k(a,25)}function M(a){return k(a,7)^k(a,18)^a>>>3}function N(a){return k(a,17)^k(a,19)^a>>>10}function O(a,c){var b=(a&65535)+(c&65535);return((a>>>16)+(c>>>16)+(b>>>16)&65535)<<16|b&65535}function P(a,c,b,f){var e=(a&65535)+(c&65535)+(b&65535)+(f&65535);return((a>>>16)+(c>>>16)+(b>>>16)+(f>>>16)+(e>>>16)&65535)<<16|e&65535}function Q(a,c,b,f,e){var g=(a&65535)+(c&65535)+(b&
65535)+(f&65535)+(e&65535);return((a>>>16)+(c>>>16)+(b>>>16)+(f>>>16)+(e>>>16)+(g>>>16)&65535)<<16|g&65535}function q(a,c,b){var f,e,g,h,k,q,r,C,u,d,l,m,n,A,s,p,v,w,x,y,z,D,E,F,G,t=[],H,B=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,
3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];d=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428];f=[1779033703,3144134277,1013904242,
2773480762,1359893119,2600822924,528734635,1541459225];if("SHA-224"===b||"SHA-256"===b)l=64,A=16,s=1,G=Number,p=O,v=P,w=Q,x=M,y=N,z=K,D=L,F=J,E=I,d="SHA-224"===b?d:f;else throw"Unexpected error in SHA-2 implementation";a[c>>>5]|=128<<24-c%32;a[(c+65>>>9<<4)+15]=c;H=a.length;for(m=0;m<H;m+=A){c=d[0];f=d[1];e=d[2];g=d[3];h=d[4];k=d[5];q=d[6];r=d[7];for(n=0;n<l;n+=1)t[n]=16>n?new G(a[n*s+m],a[n*s+m+1]):v(y(t[n-2]),t[n-7],x(t[n-15]),t[n-16]),C=w(r,D(h),E(h,k,q),B[n],t[n]),u=p(z(c),F(c,f,e)),r=q,q=k,k=
h,h=p(g,C),g=e,e=f,f=c,c=p(C,u);d[0]=p(c,d[0]);d[1]=p(f,d[1]);d[2]=p(e,d[2]);d[3]=p(g,d[3]);d[4]=p(h,d[4]);d[5]=p(k,d[5]);d[6]=p(q,d[6]);d[7]=p(r,d[7])}if("SHA-224"===b)a=[d[0],d[1],d[2],d[3],d[4],d[5],d[6]];else if("SHA-256"===b)a=d;else throw"Unexpected error in SHA-2 implementation";return a}"function"===typeof define&&typeof define.amd?define(function(){return r}):"undefined"!==typeof exports?"undefined"!==typeof module&&module.exports?module.exports=exports=r:exports=r:B.jsSHA=r})(npu);

/* Run the script */
npu.init();