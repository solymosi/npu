// ==UserScript==
// @name           Neptun PowerUp!
// @namespace      http://example.org
// @description    Felturbózza a Neptun-odat
// @version        1.22.2
// @include        https://*neptun*/*hallgato*/*
// @include        https://*hallgato*.*neptun*/*
// @include        https://netw6.nnet.sze.hu/hallgato/*
// @include        https://nappw.dfad.duf.hu/hallgato/*
// @include        https://host.sdakft.hu/*
// @include        https://neptun.ejf.hu/ejfhw/*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_info
// ==/UserScript==

$ = unsafeWindow.jQuery;

$.neptun = {
	
	/* == VARIABLES == */
	
		/* Stored login information */
		users: [],
	
	/* == STARTUP == */
	
		/* Run features */
		init: function() {
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
				
				if(this.isPage("0303") || this.isPage("h_addsubjects")) {
					this.fixCourseList();
					this.initCourseAutoList();
					this.initCourseStore();
				}
				
				if(this.isPage("0401") || this.isPage("h_exams")) {
					this.fixExamList();
					this.initExamAutoList();
				}
			}
		},
	
	/* == LOGIN == */
	
		/* Load and display user select field */
		initUserSelect: function() {
			$.neptun.loadUsers();

			$(".login_left_side .login_input").css("text-align", "left");
			
			var selectField = $('<select id="user_sel" class="bevitelimezo" name="user_sel"></select>').hide();
			for(var i = 0; i < $.neptun.users.length; i++) {
				selectField.append('<option id="' + $.neptun.users[i][0]+ '" value="' + $.neptun.users[i][0] + '" class="neptun_kod">' + $.neptun.users[i][0] + '</option>');
			}
			
			selectField.append('<option disabled="disabled" class="user_separator">&nbsp;</option>');

			selectField.append('<option id="other_user" value="__OTHER__">Más felhasználó...</option>');
			selectField.append('<option id="edit_list" value="__DELETE__">Tárolt kód törlése...</option>');
			
			$("td", selectField).css("position", "relative");
			selectField.css("font-weight", "bold").css("font-family", "consolas, courier new, courier, monospace").css("font-size", "1.5em");
			$("option[class!=neptun_kod]", selectField).css("font-size", "0.8em").css("font-family", "tahoma").css("font-weight", "normal").css("color", "#666").css("font-style", "italic");
			$("option.user_separator", selectField).css("font-size", "0.5em");
			
			selectField.bind("mousedown focus change", function() { $.neptun.abortAutoLogin() });
			$("#pwd, #Submit, #btnSubmit").bind("mousedown focus change", function() { $.neptun.abortAutoLogin() });
			
			selectField.bind("change", function() {
				$.neptun.clearLogin();
				
				if($(this).val() == "__OTHER__") {
					$.neptun.hideSelect();
					return false;
				}
				
				if($(this).val() == "__DELETE__") {
					$("#user_sel").val($.neptun.users[0][0]).trigger("change");
					var defaultString = "mindegyiket";
					for(var i = 0; i < $.neptun.users.length; i++) {
						defaultString += "   /   " + $.neptun.users[i][0];
					}
					itemToDelete = unsafeWindow.prompt("Írd be a törlendo neptun kódot. Az összes törléséhez írd be: MINDEGYIKET", defaultString);
					if(itemToDelete == "" || itemToDelete == null) {
						return false;
					}
					
					if(itemToDelete.toUpperCase() == "MINDEGYIKET") {
						$.neptun.users = [];
						$.neptun.saveUsers();
						alert("Az összes tárolt neptun kód törölve lett a bejelentkezési listából.");
						window.location.reload();
						return false;
					}
					
					var indexToDelete = -1;
					for(var i = 0; i < $.neptun.users.length; i++) {
						if($.neptun.users[i][0] == itemToDelete.toUpperCase()) {
							indexToDelete = i;
							itemToDelete = $.neptun.users[i][0];
							break;
						}
					}
					if(indexToDelete == -1) {
						if(confirm("A megadott neptun kód nincs benne a tárolt listában. Megpróbálod újra?")) {
							$("#user_sel").val("__DELETE__").trigger("change");
						}
						return false;
					}
					
					$.neptun.users.splice(indexToDelete, 1);
					$.neptun.saveUsers();
					alert("A(z) " + itemToDelete + " felhasználó törölve lett a bejelentkezési listából.");
					window.location.reload();
					return false;
				}
				
				$("#user").val($.neptun.users[$(this).get(0).selectedIndex][0]);
				$("#pwd").val($.neptun.users[$(this).get(0).selectedIndex][1]);
			});
			
			$("input[type=submit].login_button").attr("onclick", "").bind("click", function(e) {
				e.preventDefault();
				
				if($("#user_sel").val() == "__OTHER__") {
					if($("#user").val().trim() == "" || $("#pwd").val().trim() == "") {
						return;
					}
					
					var foundID = -1;
					for(var i = 0; i < $.neptun.users.length; i++) {
						if($.neptun.users[i][0] == $("#user").val().toUpperCase()) {
							foundID = i;
						}
					}
					
					if(foundID == -1) {
						if(confirm("Szeretnéd menteni a beírt adatokat, hogy késobb egy kattintással be tudj lépni errol a számítógéprol?")) {
							$.neptun.users.push([$("#user").val().toUpperCase(), $("#pwd").val()]);
							$.neptun.saveUsers();
						}
						$.neptun.submitLogin();
						return;
					}
					else {
						$("#user_sel").val($.neptun.users[foundID][0]);
					}
				}
				
				if($("#user_sel").val() == "__DELETE__") {
					return;
				}
				
				if($("#pwd").val() != $.neptun.users[$("#user_sel").get(0).selectedIndex][1]) {
					if(confirm("Szeretnéd megváltoztatni a(z) " + $("#user").val().toUpperCase() + " felhasználó tárolt jelszavát a most beírt jelszóra?")) {
						$.neptun.users[$("#user_sel").get(0).selectedIndex][1] = $("#pwd").val();
						$.neptun.saveUsers();
					}
				}
				
				$.neptun.submitLogin();
				return;
			});
			
			$("#user").parent().append(selectField);
			$.neptun.showSelect();
			selectField.trigger("change");
		},
		
		/* Initialize auto login and start countdown */
		initAutoLogin: function() {
			if($.neptun.users.length < 1) {
				return;
			}
			var submit = $("#Submit, #btnSubmit");
			$.autoLoginRemaining = 3;
			$.loginButtonText = submit.attr("value");
			submit.attr("value", $.loginButtonText + " (" + $.autoLoginRemaining + ")");
			$(".login_button_td").append('<div id="abortAL" style="text-align: center; margin: 23px 0 0 128px"><a href="javascript:$.neptun.abortAutoLogin()">Megszakít</a></div>');
			$.autoLoginTimer = window.setInterval(function() {
				$.autoLoginRemaining--;
				submit.attr("value", $.loginButtonText + " (" + $.autoLoginRemaining + ")");
				if($.autoLoginRemaining <= 0) {
					$.neptun.submitLogin();
					$.neptun.abortAutoLogin();
					submit.attr("value", $.loginButtonText + "...");
				}
			}, 1000);
		},
		
		/* Abort the auto login countdown */
		abortAutoLogin: function() {
			window.clearInterval($.autoLoginTimer);
			$("#Submit, #btnSubmit").attr("value", $.loginButtonText);
			$("#abortAL").remove();
		},
		
		/* Clears the login form */
		clearLogin: function() {
			$("#user").val("");
			$("#pwd").val("");
		},
		
		/* Load all stored user data */
		loadUsers: function() {
			try {
				this.users = JSON.parse(GM_getValue("neptun.users"));
			}
			catch(e) { }
		},
		
		/* Store user data in the user profile */
		saveUsers: function() {
			this.runAsync(function() {
				GM_setValue("neptun.users", JSON.stringify($.neptun.users));
			});
		},
		
		/* Display user select field */
		showSelect: function() {
			$("#user").hide();
			$("#user_sel").show().focus();
			$.neptun.runEval(' Page_Validators[0].controltovalidate = "user_sel" ');
		},
		
		/* Hide user select field and display original textbox */
		hideSelect: function() {
			$("#user_sel").hide();
			$("#user").show().focus();
			$.neptun.runEval(' Page_Validators[0].controltovalidate = "user" ');
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
			var color = $("#upTraining_lbtnChangeTraining").css("color");
			$('<style type="text/css">ul.menubar, .top_menu_wrapper { cursor: default !important } #mb1 li.menu-parent { color: #525659 !important } #mb1 li.menu-parent.has-target { color: ' + color + ' !important } #mb1 li.menu-parent.has-target:hover { color: #000 !important }</style>').appendTo("head");
			$("#mb1_Tanulmanyok").attr("targeturl", "main.aspx?ctrl=0206&ismenuclick=true").attr("hoverid", "#mb1_Tanulmanyok_Leckekonyv");
			$("#mb1_Targyak").attr("targeturl", "main.aspx?ctrl=0303&ismenuclick=true").attr("hoverid", "#mb1_Targyak_Targyfelvetel");
			$("#mb1_Vizsgak").attr("targeturl", "main.aspx?ctrl=0401&ismenuclick=true").attr("hoverid", "#mb1_Vizsgak_Vizsgajelentkezes");
			var orarend = $('<li aria-haspopup="false" tabindex="0" role="menuitem" class="menu-parent has-target" id="mb1_Orarend" targeturl="main.aspx?ctrl=0203&amp;ismenuclick=true">Órarend</li>');
			$("#mb1_Targyak").before(orarend);
			$("#mb1_Tanulmanyok_Órarend").remove();
			$("#Menu_neptun_Menu_neptun li[targeturl]").css("position", "relative").each(function() {
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
			window.setInterval(function() {
				var termSelect = $("#upFilter_cmbTerms, #upFilter_cmb_m_cmb, #cmbTermsNormal, #upFilter_cmbTerms_m_cmb").first();
				if(termSelect.is(":visible")) {
					$(".termSelect").remove();
					var select = $('<ul class="termSelect"></ul>');
					$("option", termSelect).each(function() {
						if($(this).attr("value") == "-1") { return; }
						var item = $('<li><a href="#" data-value="' + $(this).attr("value") + '" class="' + (termSelect.val() == $(this).attr("value") ? "button" : "") + '">' + $(this).html() + "</a></li>");
						$("a", item).bind("click", function(e) {
							e.preventDefault();
							if($(this).hasClass("button")) {
								return;
							}
							termSelect.val($(this).data("value"));
							$(".termSelect li.selected").removeClass("selected");
							item.addClass("selected");
							var onChange = termSelect[0].getAttributeNode("onchange");
							if(onChange) {
								$.neptun.runAsync(function() { $.neptun.runEval(onChange.value); });
							}
							if(!$.neptun.isPage("0303") && !$.neptun.isPage("h_addsubjects") && !$.neptun.isPage("0401") && !$.neptun.isPage("h_exams") && !$.neptun.isPage("0503") && !$.neptun.isPage("h_transactionlist")) {
								$("#upFilter_expandedsearchbutton").click();
							}
						});
						select.append(item);
					});
					termSelect.parent().append(select);
					termSelect.hide();
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
							$.neptun.runEval(onChange.value);
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
				unsafeWindow.ShowModal = function() { };
				unsafeWindow.clearTimeout(unsafeWindow.timerID);
				unsafeWindow.clearTimeout(unsafeWindow.timerID2);
				if($("#npuStatus").size() == 0) {
					$("#upTraining_lblRemainingTime").html('<span id="npuStatus" style="font-weight: normal"><a href="https://userscripts.org/scripts/show/157733" target="_blank">Neptun PowerUp!</a> v' + GM_info["script"]["version"] + '</span>');
				}
				unsafeWindow.sessionEndDate = null;
			}, 1000);
		},
		
	/* == COURSE LIST == */
	
		/* Stored course choices */
		courseChoices: { },
		
		/* Enhance course list style and functionality */
		fixCourseList: function() {
			$('<style type="text/css"> #upFunction_h_addsubjects_upGrid_gridSubjects_bodytable tr.Row1_Bold td, #upFunction_h_addsubjects_upModal_userctrlupFunction_h_addsubjects_upModal_modal_subjectdata_Subject_data1_upParent_tab_ctl00_upAddSubjects_Addsubject_course1_upGrid_gridCourses_bodytable tr.Row1_sel td, #upFunction_h_addsubjects_upModal_userctrlupFunction_h_addsubjects_upModal_modal_subjectdata_Subject_data1_upParent_tab_ctl00_upAddSubjects_Addsubject_course1_upGrid_gridCourses_bodytable tr.Row1_Bold_sel td { background: #F8EFB1 !important; font-weight: bold; color: #525659; } #upFunction_h_addsubjects_upGrid_gridSubjects_bodytable tr, #upFunction_h_addsubjects_upModal_userctrlupFunction_h_addsubjects_upModal_modal_subjectdata_Subject_data1_upParent_tab_ctl00_upAddSubjects_Addsubject_course1_upGrid_gridCourses_bodytable tr { cursor: pointer; } #upFunction_h_addsubjects_upGrid_gridSubjects_bodytable tr.npu_completed td { background: #D5EFBA !important; font-weight: bold; color: #525659; } </style>').appendTo("head");
			$("#upFunction_h_addsubjects_upModal_userctrlupFunction_h_addsubjects_upModal_modal_subjectdata_Subject_data1_upParent_tab_ctl00_upAddSubjects_Addsubject_course1_upGrid_gridCourses_bodytable tbody td").live("click", function(e) {
				if($(e.target).closest("input[type=checkbox]").size() == 0 && $(e.target).closest("td[onclick]").size() == 0) {
					var checkbox = $("input[type=checkbox]", $(this).closest("tr")).get(0);
					checkbox.checked = !checkbox.checked;
					var obj = unsafeWindow[$("#upFunction_h_addsubjects_upModal_userctrlupFunction_h_addsubjects_upModal_modal_subjectdata_Subject_data1_upParent_tab_ctl00_upAddSubjects_Addsubject_course1_upGrid_gridCourses_gridmaindiv").attr("instanceid")];
					try { obj.Cv($("input[type=checkbox]", $(this).closest("tr")).get(0), "1"); } catch(ex) { }
					e.preventDefault();
					return false;
				}
			});
			$("#upFunction_h_addsubjects_upGrid_gridSubjects_bodytable tbody td").live("click", function(e) {
				if($(e.target).closest("td[onclick]").size() == 0 && $(e.target).closest("td.contextcell_sel").size() == 0) {
					$.neptun.runEval($("td[onclick]", $(this).closest("tr")).attr("onclick"));
					e.preventDefault();
					return false;
				}
			});
			window.setInterval(function() {
				var table = $("#upFunction_h_addsubjects_upGrid_gridSubjects_bodytable");
				if(table.attr("data-painted") != "1") {
					table.attr("data-painted", "1");
					$("tbody tr", table).each(function() {
						if($('td[n="Completed"] img', this).size() != 0) {
							$(this).addClass("npu_completed");
						}
					});
				}
			}, 250);
		},
		
		/* Automatically press submit button on course list page */
		initCourseAutoList: function() {
			window.setInterval(function() {
				if(!$.courseListCalled && $("#upFunction_h_addsubjects_upGrid_gridSubjects_gridmaindiv").size() == 0) {
					$.courseListCalled = true;
					$("#upFilter_expandedsearchbutton").click();
				}
			}, 250);
			window.setInterval(function() {
				if($.courseListCalled && $("#upFunction_h_addsubjects_upGrid_gridSubjects_gridmaindiv").size() != 0) {
					$.courseListCalled = false;
				}
			}, 100);
		},
		
		/* Initialize course choice storage and mark subject and course lines with stored course choices */
		initCourseStore: function() {
			$('<style type="text/css"> #upFunction_h_addsubjects_upGrid_gridSubjects_bodytable tr td.npu_choice_mark, #upFunction_h_addsubjects_upModal_userctrlupFunction_h_addsubjects_upModal_modal_subjectdata_Subject_data1_upParent_tab_ctl00_upAddSubjects_Addsubject_course1_upGrid_gridCourses_bodytable  tr td.npu_choice_mark { background: #C00 !important } </style>').appendTo("head");
			this.loadCourseChoices();
			var currentUser = this.getUserID();
			
			window.setInterval(function() {
				var table = $("#upFunction_h_addsubjects_upGrid_gridSubjects_bodytable");
				if(table.attr("data-choices-displayed") != "1") {
					table.attr("data-choices-displayed", "1");
					$("tbody tr", table).each(function() {
						var subjectCode = $("td:nth-child(3)", this).text().trim().toUpperCase();
						var choices = $.neptun.courseChoices[currentUser][subjectCode];
						if(typeof choices != "undefined" && choices.length > 0) {
							$("td:first-child", this).addClass("npu_choice_mark");
						}
						else {
							$("td:first-child", this).removeClass("npu_choice_mark");
						}
					});
				}
				
				var innerTable = $("#upFunction_h_addsubjects_upModal_userctrlupFunction_h_addsubjects_upModal_modal_subjectdata_Subject_data1_upParent_tab_ctl00_upAddSubjects_Addsubject_course1_upGrid_gridCourses_bodytable");
				if(innerTable.attr("data-inner-choices-displayed") != "1") {
					innerTable.attr("data-inner-choices-displayed", "1");
					$("tbody tr", innerTable).each(function() {
						$("input[type=checkbox]", this).removeAttr("disabled");
					});
					var subjectText = $("#upFunction_h_addsubjects_upModal_userctrlupFunction_h_addsubjects_upModal_modal_subjectdata_Subject_data1_upParent_tab_ctl00_upAddSubjects .subtitle_table h2").html();
					if(subjectText != null) {
						var subjectCode = subjectText.match(/^.*\((.*)\)<br>.*$/)[1];
						if(typeof subjectCode != "undefined") {
							if(typeof $.neptun.courseChoices[currentUser] == "undefined") {
								$.neptun.courseChoices[currentUser] = { };
							}
							var choices = $.neptun.courseChoices[currentUser][subjectCode.trim().toUpperCase()];
							var hasChoices = (typeof choices != "undefined" && choices.length > 0);
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
								var header = $("#upFunction_h_addsubjects_upModal_userctrlupFunction_h_addsubjects_upModal_modal_subjectdata_Subject_data1_upParent_tab_ctl00_upAddSubjects_Addsubject_course1_upGrid_gridCourses_gridmaindiv .grid_functiontable_top .functionitem");
								var footer = $("#upFunction_h_addsubjects_upModal_userctrlupFunction_h_addsubjects_upModal_modal_subjectdata_Subject_data1_upParent_tab_ctl00_upAddSubjects_Addsubject_course1_upGrid_gridCourses_tablebottom .grid_functiontable_bottom .functionitem");
								var buttonBarExtensions = $('<span class="npu_course_choice_actions" style="margin: 0 20px"><span class="FunctionCommandTitle">Választás tárolása ezen a gépen:</span><input type="button" value="Tárolás" class="gridbutton npu_course_choice_save"><input type="button" value="Betöltés" class="gridbutton npu_course_choice_load" style="display: none"><input type="button" value="Betöltés és Mentés" class="gridbutton npu_course_choice_apply" style="display: none"><input type="button" value="Törlés" class="gridbutton npu_course_choice_delete" style="display: none"></span>');
								header.append(buttonBarExtensions);
								footer.prepend(buttonBarExtensions.clone());
								var refreshScreen = function() {
									table.attr("data-choices-displayed", "0");
									innerTable.attr("data-inner-choices-displayed", "0");
								};
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
										alert("A kiválasztott kurzusok listájának tárolásához elobb válassz ki legalább egy kurzust.");
									}
									else {
										$.neptun.courseChoices[currentUser][subjectCode.trim().toUpperCase()] = selectedCourses;
										$.neptun.saveCourseChoices();
										refreshScreen();
										alert("A kiválasztott kurzusok listája sikeresen tárolva lett a gépeden.");
									}
								});
								$(".npu_course_choice_actions .npu_course_choice_load").click(function() {
									$("tbody tr", innerTable).each(function() {
										var courseCode = $("td:nth-child(2)", this).text().trim().toUpperCase();
										var checkbox = $("input[type=checkbox]", this).get(0);
										checkbox.checked = $.inArray(courseCode, $.neptun.courseChoices[currentUser][subjectCode.trim().toUpperCase()]) != -1;
										var obj = unsafeWindow[$("#upFunction_h_addsubjects_upModal_userctrlupFunction_h_addsubjects_upModal_modal_subjectdata_Subject_data1_upParent_tab_ctl00_upAddSubjects_Addsubject_course1_upGrid_gridCourses_gridmaindiv").attr("instanceid")];
										try { obj.Cv(checkbox, "1"); } catch(ex) { }
									});
								});
								$(".npu_course_choice_actions .npu_course_choice_apply").click(function() {
									$(".npu_course_choice_actions .npu_course_choice_load").trigger("click");
									var obj = unsafeWindow[$("#upFunction_h_addsubjects_upModal_userctrlupFunction_h_addsubjects_upModal_modal_subjectdata_Subject_data1_upParent_tab_ctl00_upAddSubjects_Addsubject_course1_upGrid_gridCourses_gridmaindiv").attr("instanceid")];
									try { obj.SelectFunction("update"); } catch(ex) { }
								});
								$(".npu_course_choice_actions .npu_course_choice_delete").click(function() {
									if(confirm("Valóban törölni szeretnéd a tárolt kurzus-kiválasztást?")) {
										delete $.neptun.courseChoices[currentUser][subjectCode.trim().toUpperCase()];
										$.neptun.saveCourseChoices();
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
		
		/* Load all stored course choice data */
		loadCourseChoices: function() {
			try {
				this.runAsync(function() {
					$.neptun.courseChoices = JSON.parse(GM_getValue("neptun.courses"));
				});
			}
			catch(e) { }
		},
		
		/* Store stored course choice data in the user profile */
		saveCourseChoices: function() {
			this.runAsync(function() {
				GM_setValue("neptun.courses", JSON.stringify($.neptun.courseChoices));
			});
		},
		
	/* == EXAM LIST == */
	
		/* Enhance exam list style and functionality */
		fixExamList: function() {
			$('<style type="text/css"> #upFunction_h_exams_upGrid_gridExamList_bodytable tr.gridrow_blue td { background: #F8EFB1 !important; font-weight: bold; color: #525659 !important; } #upFunction_h_exams_upGrid_gridExamList_bodytable tr { cursor: pointer; } </style>').appendTo("head");
			$("#upFunction_h_exams_upGrid_gridExamList_bodytable tbody td").live("click", function(e) {
				if($(e.target).closest("td[onclick], td.contextcell_sel, td.contextcell").size() == 0) {
					$("td.contextcell, td.contextcell_sel", $(this).closest("tr")).trigger("click");
					e.preventDefault();
					return false;
				}
			});
		},
		
		/* Automatically list exams on page load and subject change */
		initExamAutoList: function() {
			$('<style type="text/css"> #upFilter_bodytable tr.nostyle { display: none } </style>').appendTo("head");
			$("#upFilter_cmbSubjects").live("change", function() {
				$.examListSubjectValue = $(this).val();
			});
			window.setInterval(function() {
				var panel = $("#upFilter_panFilter table.searchpanel");
				if(panel.attr("data-listing") != "1" && ($.examListTerm != $("#upFilter_cmbTerms option[selected]").attr("value") || $.examListSubject != $.examListSubjectValue)) {
					panel.attr("data-listing", "1");
					$.examListTerm = $("#upFilter_cmbTerms option[selected]").attr("value");
					$.examListSubject = $.examListSubjectValue;
					$("#upFilter_expandedsearchbutton").click();
				}
			}, 100);
		},
		
	/* == MISC == */
	
		/* Parses and returns the ID of the current user */
		getUserID: function() {
			if($("#upTraining_topname").size() > 0) {
				var input = $("#upTraining_topname").text();
				return input.substring(input.indexOf(" - ") + 3).toUpperCase();
			}
		},
		
		/* Returns whether we are on the login page */
		isLogin: function() {
			return $("td.login_left_side").size() > 0;
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
};

/* Run the script */
$.neptun.init();