(function () {
    function beforeUnloadListener(e) {
        const message = "Are you sure you want to leave this page? Changes you made may not be saved.";
        e.preventDefault();
        e.returnValue = message;
        return message;
    }

    // This script runs in the page context (global scope)
    function processEventListeners() {
        if (typeof eventListeners !== 'undefined' && Array.isArray(eventListeners)) {
            const processedListeners = eventListeners.map(item => {
                if (item && typeof item === 'object' && 'handler' in item) {
                    try {
                        const handlerString = item.handler.toString();
                        const match = handlerString.match(/'([^']+)'/);
                        const extractedValue = match ? match[1] : 'No match found';

                        return {
                            ...item,
                            processedHandler: extractedValue
                        };
                    } catch (error) {
                        return {
                            ...item,
                            processedHandler: 'Error processing handler'
                        };
                    }
                }
                return item; // Return unchanged if it doesn't meet our criteria
            });

            if (processedListeners.length > 0) {
                insertPopup(processedListeners);
                return;
            }
        }

        // If eventListeners is not defined or empty, wait and try again
        setTimeout(processEventListeners, 100);
    }

    function insertPopup(eventListenersValue) {
        // Global redirection control
        let allowRedirection = false;
        ;

        // Function to toggle redirection behavior
        function toggleRedirection() {
            allowRedirection = !allowRedirection;
            // console.log(`Redirection is now ${allowRedirection ? "enabled" : "disabled"}.`);
        }

        // Function to recursively access Shadow DOMs and make elements clickable
        function accessDeepNodesAndMakeClickable(rootNode) {
            const elements = rootNode.querySelectorAll('*');
            elements.forEach((element) => {
                // element.addEventListener('mouseenter', (e) => {
                //     // element.style.outline = '2px solid red';  // Visual feedback for hover
                //     element.click();
                // });

                // element.addEventListener('mouseleave', (e) => {
                //     // element.style.outline = 'none';  // Remove visual feedback
                // });

                element.addEventListener('click', (e) => {
                    if (!allowRedirection) {
                        e.preventDefault(); // Prevents navigation
                        // if (element.tagName == 'BUTTON' || element.tagName == 'RHCL-BUTTON' || element.tagName.toLowerCase().includes('search-bar') || element.tagName.toLowerCase().includes('rhcl-button')) {
                        //     e.stopPropagation();
                        // }
                        //  console.log(`Clicked element: ${element.tagName}`);
                        window.stop();
                        window.addEventListener('beforeunload', beforeUnloadListener);
                    } else {
                        // console.log(`Redirection is allowed for: ${element.tagName}`);
                        window.removeEventListener('beforeunload', beforeUnloadListener);
                    }
                });

                if (element.shadowRoot) {
                    accessDeepNodesAndMakeClickable(element.shadowRoot);
                }
            });
        }




        // Call this to make deep nodes clickable
        accessDeepNodesAndMakeClickable(document);

        function getQueryParamtersjs(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        }

        const paramN = 'analytics_ext_tool';
        const paramVa = getQueryParamtersjs(paramN);


        if (paramVa == '100true001') {
            if (!confirm("confirm if you would like to test")) {
                removeQueryParameter("analytics_ext_tool");
            }
        }

        //create event listeners for cl components
        const eventealListener = eventListenersValue.map(item => {
            return {
                ...item,
                handler: (e) => rh_tracking_custom(item.processedHandler, e)
            };
        });

        //Add event listeners
        eventealListener.forEach(({ event, handler }) => {
            document.addEventListener(event, handler);
        });


        function removeQueryParameter(param) {
            var url = new URL(window.location.href);
            url.searchParams.delete(param); // Remove the query parameter
            window.location.href = url.href; // Refresh the page with the updated URL
        }

        // Function to create a draggable, resizable, and minimizable popup
        function createPopup(content, eventObj) {
            // Check if a pop-up already exists
            let existingPopup = document.getElementById('data-popup');
            let existingPopups = document.querySelectorAll('#data-popup').length;
            // console.log('existingPopups', existingPopups);
            // let doublefire = false;
            // if (document.querySelector('#data-popup > div:nth-child(2) > div:nth-child(4)')) {
            //     doublefire = document.querySelector('#data-popup > div:nth-child(2) > div:nth-child(4)').innerText.toLowerCase().includes('search');
            // }
            // console.log('asdasdasdasd', eventObj);


            console.log('tealiumEventName', eventObj);
            if (existingPopup && eventObj.tealium_event !== 'search') {
                document.querySelectorAll('#data-popup').forEach(element => {
                    element.remove();
                });
            }

            // if (existingPopup && !doublefire && existingPopups == 1) {
            //     document.querySelectorAll('#data-popup').forEach(element => {
            //         element.remove();
            //     });
            // }

            // Create the pop-up container
            const popup = document.createElement('div');
            popup.id = 'data-popup';
            popup.style.border = "solid 1px #f4f4f4";
            popup.className = existingPopups && eventObj.tealium_event == 'search' ? 'data-popup-1' : '';
            popup.style.position = 'fixed';
            popup.style.bottom = '10px';
            popup.style.right = existingPopups && eventObj.tealium_event == 'search' ? '390px' : '10px';
            popup.style.width = '360px';
            popup.style.backgroundColor = '#000'; //asdasdasdasd;
            // popup.style.border = '3px solid #000';
            popup.style.borderRadius = '8px';
            popup.style.boxShadow = '0px 4px 20px rgba(0, 0, 0, 0.8), 0px 6px 30px rgba(0, 0, 128, 0.4)';
            popup.style.fontFamily = 'Roboto, sans-serif';
            popup.style.color = '#202124';
            popup.style.fontSize = '13px';
            popup.style.lineHeight = '20px';
            popup.style.zIndex = '9999';
            popup.style.overflowY = 'auto'; // Allow scrolling if content overflows
            popup.style.maxHeight = '90vh';
            // popup.style.padding = '10px';
            popup.style.boxShadow = '0px 8px 16px rgba(0, 0, 0, 0.6)';


            // Load Google Fonts
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
            // Create the
            const buttonNavigate = document.createElement('div');
            // buttonNavigate.style.alignItems = 'center';
            buttonNavigate.innerHTML = 'Navigate';
            buttonNavigate.style.padding = '2px 4px';
            buttonNavigate.id = 'buttonNavigate';
            // buttonNavigate.style.border = 'solid 1px #000';
            buttonNavigate.style.color = 'white';
            buttonNavigate.style.backgroundColor = '#CC0033';
            buttonNavigate.style.textAlign = 'center';
            buttonNavigate.style.fontWeight = 'bold';
            // buttonNavigate.style.borderRadius = '20px';
            buttonNavigate.style.fontSize = '11px';
            // buttonNavigate.style.marginRight = '12px';
            buttonNavigate.style.borderRadius = '5px';


            // Add event listener for mouseover (hover)
            buttonNavigate.addEventListener('mouseover', function () {
                // buttonNavigate.style.color = 'black';  // Change color to blue on hover
                // buttonNavigate.style.border = 'solid 2px blue';
                buttonNavigate.style.cursor = 'pointer';
                // buttonNavigate.style.backgroundColor = '#cccccc';  // Reset color when hover ends
            });

            // Add event listener for mouseout (when hover ends)
            buttonNavigate.addEventListener('mouseout', function () {
                // buttonNavigate.style.backgroundColor = '#f4f4f4';  // Reset color when hover ends
                // buttonNavigate.style.border = 'solid 2px #CC0033';
            });

            // Create the
            const buttonBar = document.createElement('div');
            buttonBar.style.display = 'flex';
            buttonBar.style.justifyContent = 'space-between';
            buttonBar.style.alignItems = 'center';
            buttonBar.style.padding = '10px ';
            // buttonBar.style.cursor = "move"; // Make the title draggable
            buttonBar.style.border = 'solid 5px black'; //asdasdasdasd;
            // buttonBar.style.borderBottom = 'solid 0px #000';
            // buttonBar.style.padding = '2px';
            buttonBar.style.backgroundColor = 'black'; //asdasdasdasd;
            buttonBar.style.borderTopRightRadius = '8px';
            buttonBar.style.borderTopLeftRadius = '8px';
            // buttonBar.style.border = 'none';

            const popupTitle = document.createElement('div');
            popupTitle.innerHTML = 'RHCL-Extension';
            popupTitle.style.fontSize = '16px'; // Larger font for more prominence
            popupTitle.style.fontWeight = '700'; // Stronger bold for a professional look
            popupTitle.style.color = 'white'; // Darker text for better contrast (still minimal)
            popupTitle.style.fontFamily = "'Helvetica Neue', Arial, sans-serif"; // Professional font

            // Close button
            // const closeButton = document.createElement('span');
            // closeButton.innerHTML = '&times';
            // closeButton.style.cursor = 'pointer';
            // closeButton.style.color = 'white';
            // closeButton.style.fontSize = '22px';
            // closeButton.addEventListener('click', () => {
            //     popup.remove();
            //     removeQueryParameter("analytics_ext_tool");
            // });

            // Append title and buttons to their respective containers
            // buttonBar.appendChild(popupTitle); //

            const righcontainer = document.createElement('div');
            righcontainer.id = 'righcontainer';
            righcontainer.style.display = 'flex';
            righcontainer.appendChild(buttonNavigate); // navigate button
            // righcontainer.appendChild(closeButton); //
            righcontainer.style.justifyContent = 'space-between';
            righcontainer.style.alignItems = 'center';

            buttonBar.appendChild(popupTitle); //
            buttonBar.appendChild(righcontainer); //
            popup.appendChild(buttonBar); // Buttons go below the title

            // Content container
            const contentDiv = document.createElement('div');
            contentDiv.style.overflowY = 'auto'; // Allow scrolling within the content
            contentDiv.style.height = 'calc(100% - 60px)';
            contentDiv.style.border = 'solid 5px black'; //asdasdasdasd;
            contentDiv.style.borderTop = 'none'; //asdasdasdasd;
            contentDiv.style.padding = '6px';
            contentDiv.style.backgroundColor = 'white';
            contentDiv.style.borderBottomRightRadius = '8px';
            contentDiv.style.borderBottomLeftRadius = '8px';
            contentDiv.innerHTML = content;
            popup.appendChild(contentDiv);

            // Append the pop-up to the body
            document.body.appendChild(popup);

            // Make popup draggable
            let offsetX = 0, offsetY = 0, isDragging = false;

            popup.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - popup.getBoundingClientRect().left;
                offsetY = e.clientY - popup.getBoundingClientRect().top;
                popup.style.userSelect = 'none'; // Prevent text selection while dragging
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    let left = e.clientX - offsetX;
                    let top = e.clientY - offsetY;
                    popup.style.left = `${left}px`;
                    popup.style.top = `${top}px`;
                    popup.style.bottom = 'auto'; // Prevent snapping back to bottom
                    popup.style.right = 'auto';  // Prevent snapping back to right
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                popup.style.userSelect = 'auto'; // Restore text selection after dragging
            });

            // Resizing functionality
            addResizeHandles(popup);
        }

        // Function to add resize handles to the popup
        function addResizeHandles(popup) {
            const resizeHandles = ['top', 'right', 'bottom', 'left', 'top-right', 'top-left', 'bottom-right', 'bottom-left'];

            resizeHandles.forEach((handle) => {
                const resizer = document.createElement('div');
                resizer.className = `resizer-${handle}`;
                resizer.style.position = 'absolute';
                resizer.style.background = 'transparent';
                resizer.style.cursor = `${handle}-resize`;

                switch (handle) {
                    case 'top':
                        resizer.style.top = '0';
                        resizer.style.left = '0';
                        resizer.style.right = '0';
                        resizer.style.height = '5px';
                        break;
                    case 'right':
                        resizer.style.top = '0';
                        resizer.style.right = '0';
                        resizer.style.bottom = '0';
                        resizer.style.width = '5px';
                        break;
                    case 'bottom':
                        resizer.style.bottom = '0';
                        resizer.style.left = '0';
                        resizer.style.right = '0';
                        resizer.style.height = '5px';
                        break;
                    case 'left':
                        resizer.style.top = '0';
                        resizer.style.left = '0';
                        resizer.style.bottom = '0';
                        resizer.style.width = '5px';
                        break;
                    case 'top-right':
                        resizer.style.top = '0';
                        resizer.style.right = '0';
                        resizer.style.width = '10px';
                        resizer.style.height = '10px';
                        break;
                    case 'top-left':
                        resizer.style.top = '0';
                        resizer.style.left = '0';
                        resizer.style.width = '10px';
                        resizer.style.height = '10px';
                        break;
                    case 'bottom-right':
                        resizer.style.bottom = '0';
                        resizer.style.right = '0';
                        resizer.style.width = '10px';
                        resizer.style.height = '10px';
                        break;
                    case 'bottom-left':
                        resizer.style.bottom = '0';
                        resizer.style.left = '0';
                        resizer.style.width = '10px';
                        resizer.style.height = '10px';
                        break;
                }

                popup.appendChild(resizer);

                // Add resizing functionality
                resizer.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startWidth = parseInt(document.defaultView.getComputedStyle(popup).width, 10);
                    const startHeight = parseInt(document.defaultView.getComputedStyle(popup).height, 10);
                    const startLeft = parseInt(document.defaultView.getComputedStyle(popup).left, 10);
                    const startTop = parseInt(document.defaultView.getComputedStyle(popup).top, 10);

                    function resize(e) {
                        if (handle.includes('right')) {
                            popup.style.width = startWidth + (e.clientX - startX) + 'px';
                        }
                        if (handle.includes('left')) {
                            popup.style.width = startWidth - (e.clientX - startX) + 'px';
                            popup.style.left = startLeft + (e.clientX - startX) + 'px';
                        }
                        if (handle.includes('bottom')) {
                            popup.style.height = startHeight + (e.clientY - startY) + 'px';
                        }
                        if (handle.includes('top')) {
                            popup.style.height = startHeight - (e.clientY - startY) + 'px';
                            popup.style.top = startTop + (e.clientY - startY) + 'px';
                        }
                    }

                    function stopResize() {
                        document.removeEventListener('mousemove', resize);
                        document.removeEventListener('mouseup', stopResize);
                    }

                    document.addEventListener('mousemove', resize);
                    document.addEventListener('mouseup', stopResize);
                });
            });
        }

        // Update event data pop-up content with box style
        function rh_tracking_custom(tealiumEventName, event) {
            // console.log(event)
            let element = event.composedPath()[0];
            let eventObj = {};

            if (element.trackingEnabled !== false) {
                let compound = element.componentParentRef;
                let block = null;
                if (compound) {
                    block = compound.componentParentRef;
                }

                eventObj = {
                    'tealium_event': tealiumEventName,
                    'event_action': event.type,
                    'datalayer_version': '2'
                };

                // Add logic to get event_text
                if (element.componentTrackingLabel) {
                    eventObj.event_text = element.componentTrackingLabel;
                } else if (element.label) {
                    eventObj.event_text = element.label;
                }

                // Read component properties
                eventObj["component_id_01"] = element.componentId;
                eventObj["component_title_01"] = element.componentTitle;
                eventObj["component_variant_01"] = element.componentVariant;

                // Compound
                if (compound) {
                    eventObj["component_id_02"] = compound.componentId;
                    eventObj["component_title_02"] = compound.componentTitle;
                    eventObj["component_variant_02"] = compound.componentVariant;
                }

                // Block
                if (block) {
                    eventObj["component_id_03"] = block.componentId;
                    eventObj["component_title_03"] = block.componentTitle;
                    eventObj["component_variant_03"] = block.componentVariant;
                }

                eventObj = addEventSpecificProperties(eventObj, element, tealiumEventName, event);
                eventObj = Object.fromEntries(Object.entries(eventObj).filter(([_, v]) => v != null));
            }

            // console.log('Event Data:', eventObj);


            if (eventObj.event_text) {
                eventObj.event_text = eventObj.event_text.toLowerCase();
            }
            // Example custom page path
            let lookerlink;
            if (eventObj.tealium_event && eventObj.event_action && eventObj.event_text) {
                lookerlink = `https://lookerstudio.google.com/reporting/51ae28cf-11d2-48fb-9ab8-b12e3b3e2964/page/gba5D?params=%7B%22df4%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580${eventObj.event_action}%22,%22df5%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580${eventObj.event_text.split(' ').join('%20')}%22,%22df6%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580${eventObj.tealium_event}%22%7D`;
                // lookerlink = `https://lookerstudio.google.com/reporting/51ae28cf-11d2-48fb-9ab8-b12e3b3e2964/page/gba5D?params=%7B%22df4%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580${eventObj.event_action}%22,%22df5%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580find%20your%20${eventObj.event_text.split(' ').join('%20')}%22,%22df6%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580${eventObj.tealium_event}%22,%22df8%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580${encodedCustomPagePath}%22%7D`;
                // console.log(lookerlink)
            }
            // Create popup with event data
            if (eventObj.tealium_event || eventObj.event_action || eventObj.event_text) {
                function getMetaValue(name) {
                    const metaTag = document.querySelector(`meta[property="${name}"]`);
                    return metaTag ? metaTag.getAttribute('content') : null;
                }

                createPopup(
                    `
        <div style="border:none; font-weight:bold; font-size: 15px; margin-bottom: 2px; ">Event Data</div>
            <div style="  border: 1px solid #7b7170; padding: 0 2px;  background-color:white;">
  <strong>event:</strong> ${eventObj.tealium_event}
</div>
<div style=" border-bottom: 1px solid #7b7170; padding: 0 2px; border-left: 1px solid #7b7170; border-right: 1px solid #7b7170; background-color:white;">
  <strong>event_action:</strong> ${eventObj.event_action}
</div>
<div style=" border-bottom: 1px solid #7b7170; padding: 0 2px; border-left: 1px solid #7b7170; border-right: 1px solid #7b7170;  background-color:white;">
  <strong>event_text: </strong> ${eventObj.event_text || "N/A"}
</div>
<div style="border:none; font-weight:bold; margin: 10px 0; margin-bottom: 2px; font-size: 15px;">Page Data</div>

<div style=" border: 1px solid #7b7170; padding: 0 2px;  background-color:white;">
  <strong>page_user_type: </strong> ${getMetaValue('global-content-user-focus') || "N/A"}
</div>
<div style=" border-bottom: 1px solid #7b7170; padding: 0 2px; border-left: 1px solid #7b7170; border-right: 1px solid #7b7170; background-color:white; ">
<strong>page_section: </strong> ${getMetaValue('global-content-type') || "N/A"}
</div>
<div style=" border-bottom: 1px solid #7b7170; padding: 0 2px; border-left: 1px solid #7b7170; border-right: 1px solid #7b7170; background-color:white; ">
<strong>page_path: </strong> ${window.location.pathname || "N/A"}
</div>


${eventObj["search_type"] || eventObj["search_term"] || eventObj["search_location"] ? `
<div>
    <div style="border:none; font-weight:bold; margin: 10px 0; margin-bottom: 2px; font-size: 15px;">Search Data</div>
    <div style=" border: 1px solid #7b7170; padding: 0 2px;  background-color:white;">
    <strong>search_type: </strong> ${eventObj["search_type"] || "N/A"}
    </div>
    <div style=" border-bottom: 1px solid #7b7170; padding: 0 2px; border-left: 1px solid #7b7170; border-right: 1px solid #7b7170; background-color:white; ">
    <strong>search_term: </strong> ${eventObj["search_term"] || "N/A"}
    </div>
    <div style=" border-bottom: 1px solid #7b7170; padding: 0 2px; border-left: 1px solid #7b7170; border-right: 1px solid #7b7170; background-color:white; ">
    <strong>search_location: </strong> ${eventObj["search_location"] || "N/A"}
    </div>
<div>` : ``}

   
${eventObj.component_id_01 || eventObj.component_title_01 || eventObj.component_variant_01 ? `<div style="border:none; font-weight:bold; margin: 10px 0; font-size: 15px; margin-bottom: 2px; ">Component Library Data</div>` : ''}


${eventObj.component_id_01 || eventObj.component_title_01 || eventObj.component_variant_01 ? `<div style="background-color: white;" >
<div style=" background-color: rgba(253, 174, 1, 0.2); margin-bottom: 10px"> 
 <div style=" border: 1px solid #7b7170; padding: 0 2px; "><strong>component_id_01:</strong> ${eventObj.component_id_01 || "N/A"}<br> </div>
 <div style=" border-bottom: 1px solid #7b7170; padding: 0 2px; border-left: 1px solid #7b7170; border-right: 1px solid #7b7170; "><strong>component_title_01:</strong> ${eventObj.component_title_01 || "N/A"}<br> </div>
 <div style=" border-bottom: 1px solid #7b7170; padding: 0 2px; border-left: 1px solid #7b7170; border-right: 1px solid #7b7170; "><strong>component_variant_01:</strong> ${eventObj.component_variant_01 || "N/A"}</div> </div>
</div></div>` : ''}


${eventObj.component_id_02 || eventObj.component_title_02 || eventObj.component_variant_02 ? `<div style="background-color: white;" >
<div style="background-color: rgba(227, 116, 1, 0.2); margin-bottom: 10px;">
   <div style="  border: 1px solid #7b7170; padding: 0 2px; "><strong>component_id_02:</strong> ${eventObj.component_id_02 || "N/A"}<br> </div>
   <div style=" border-bottom: 1px solid #7b7170; padding: 0 2px; border-left: 1px solid #7b7170; border-right: 1px solid #7b7170; "><strong>component_title_02:</strong> ${eventObj.component_title_02 || "N/A"}<br> </div>
   <div style=" border-bottom: 1px solid #7b7170; padding: 0 2px; border-left: 1px solid #7b7170; border-right: 1px solid #7b7170; "><strong>component_variant_02:</strong> ${eventObj.component_variant_02 || "N/A"} </div>
</div></div>`: ''}



${eventObj.component_id_03 || eventObj.component_title_03 || eventObj.component_variant_03 ? `<div style="background-color: white;" >
<div style=" background-color: rgba(164, 12, 36, 0.2); margin-bottom: 10px;">
   <div style="  border: 1px solid #7b7170; padding: 0 2px; "><strong>component_id_03:</strong> ${eventObj.component_id_03 || "N/A"}<br> </div>
   <div style=" border-bottom: 1px solid #7b7170; padding: 0 2px; border-left: 1px solid #7b7170; border-right: 1px solid #7b7170; "><strong>component_title_03:</strong> ${eventObj.component_title_03 || "N/A"}<br> </div>
   <div style=" border-bottom: 1px solid #7b7170; padding: 0 2px; border-left: 1px solid #7b7170; border-right: 1px solid #7b7170; "><strong>component_variant_03:</strong> ${eventObj.component_variant_03 || "N/A"} </div>
</div></div>`: ""}`
                    , eventObj);
                document.getElementById('buttonNavigate').addEventListener('click', (e) => {


                    if (eventObj.tealium_event !== 'search') {
                        window.removeEventListener('beforeunload', beforeUnloadListener);
                        element.click();
                        toggleRedirection();
                        element.click();
                        element.shadowRoot.querySelectorAll('*').forEach(element => {
                            element.click();
                        });
                        element.querySelectorAll('*').forEach(element => {
                            element.click();
                        });

                    } else {
                        window.removeEventListener('beforeunload', beforeUnloadListener);
                        element.click();

                        if (document.querySelectorAll('#data-popup').length > 1) {
                            document.querySelectorAll('#data-popup').forEach(cur => {
                                cur.style.display = 'none';
                            });

                        }
                    }

                });

                //     ${lookerlink ? ` <div style=" text-align: center; padding-right: 5px;">
                //     <strong><a id="lookerlink" style="color:white; font-weight: bold; font-size: 12px;" href=${lookerlink} target="_blank">View Report</a> </strong> 
                //   </div>` : ""}

            }
            if (eventObj.tealium_event && eventObj.event_action && eventObj.event_text) {
                let datapop2 = document.querySelector('.data-popup-1');
                const righContainer = datapop2 ? datapop2.querySelector('#righcontainer') : document.querySelector('#righcontainer');

                // Create the new div element only if lookerlink exists
                if (lookerlink) {
                    // const newDiv = document.createElement('div');


                    const newLink = document.createElement('a');
                    newLink.style.padding = '2px 4px';
                    newLink.style.color = 'white';
                    newLink.style.backgroundColor = '#066a7a';
                    newLink.style.textAlign = 'center';
                    newLink.style.marginRight = '7px';
                    newLink.id = 'lookerlink';
                    newLink.style.fontSize = '11px';
                    newLink.style.textDecoration = 'none';
                    newLink.style.fontWeight = 'bold';
                    newLink.style.color = 'white';
                    newLink.href = lookerlink;
                    newLink.target = '_blank';
                    newLink.textContent = 'View Report';
                    newLink.style.borderRadius = '5px';

                    // newDiv.appendChild(newLink);

                    // Prepend the new div as the first child of the #righcontainer
                    righContainer.prepend(newLink);
                }

                const link = document.getElementById('lookerlink');

                link.addEventListener('click', function (event) {
                    window.open(event.target.href, '_blank');
                });


                // Add event listener for mouseover (hover)
                link.addEventListener('mouseover', function () {
                    link.style.backgroundColor = '#f4f4ff4';  // Change color to blue on hover
                    link.style.cursor = 'pointer';
                    link.style.cursor = 'pointer';

                });

                // Add event listener for mouseout (when hover ends)
                link.addEventListener('mouseout', function () {
                    // link.style.color = 'white';  // Reset color when hover ends
                });
            }
            if (document.querySelectorAll('#data-popup').length > 1) {
                document.querySelectorAll('#data-popup').forEach(cur => {
                    if (cur.className == 'data-popup-1') {
                        cur.querySelector(" div:nth-child(2) > div:nth-child(1)").innerText = 'Event Data 02';
                        cur.querySelector('#buttonNavigate').style.display = 'none';
                    } else {
                        cur.querySelector(" div:nth-child(2) > div:nth-child(1)").innerText = 'Event Data 01';
                    }
                });

            }






        }

        // Function to add event-specific properties
        function addEventSpecificProperties(eventObj, element, tealiumEventName, originalEvent) {
            switch (tealiumEventName) {
                case "search":
                    eventObj["search_type"] = element.componentVariant;
                    switch (eventObj["search_type"]) {
                        case "location-search":
                        case "location-simple":
                            eventObj["search_location"] = originalEvent.detail.fieldOneValue;
                            eventObj["distance"] = originalEvent.detail.fieldTwoValue;
                            break;
                        case "job-search":
                        case "candidate-browse":
                        case "salary-search":
                            eventObj["search_term"] = originalEvent.detail.fieldOneValue;
                            eventObj["search_location"] = originalEvent.detail.fieldTwoValue;
                            break;
                        case "site-search":
                            eventObj["search_term"] = originalEvent.detail.fieldOneValue;
                            break;
                        case "custom":
                            eventObj["search_term"] = originalEvent.detail.fieldOneValue + " | " + originalEvent.detail.fieldTwoValue;
                            break;
                    }
                    break;
            }
            return eventObj;
        }


        //<!-- down arrow -->
        //${eventObj.component_id_02 || eventObj.component_id_02 || eventObj.component_id_02 ? '<div style="text-align: center; font-size: 16px; color: #999;">↓</div>' : ''}

    }

    // Main execution
    const url = new URL(window.location.href);
    if (url.searchParams.has('testing')) {
        processEventListeners();
    }

    // // Optional: Set up communication with content script if needed
    // function sendToContent(message) {
    //     window.postMessage({ type: "FROM_PAGE", data: message }, "*");
    // }

    // // Example: Periodically send data to content script
    // setInterval(() => {
    //     sendToContent({ eventListenersCount: eventListeners ? eventListeners.length : 0 });
    // }, 5000);


})();


