// question-drag.js - Enhanced drag and drop functionality for Question3 and Question4
document.addEventListener('DOMContentLoaded', function() {
    const currentQuestion = window.QUIZ_STATE?.currentQuestion || 0;
    const questionType = document.querySelector('.quiz-content')?.dataset.questionType;
    
    // Only apply to match-type questions
    if (questionType === 'match') {
        console.log(`Initializing enhanced drag and drop for Question ${currentQuestion}`);
        
        // Make sure jQuery and jQuery UI are available
        if (typeof $ !== 'undefined' && $.ui) {
            // Initialize draggable for technique items
            $('.technique-item').draggable({
                revert: 'invalid',
                helper: 'clone',
                cursor: 'move',
                zIndex: 100,
                start: function(event, ui) {
                    $(this).addClass('dragging');
                    ui.helper.addClass('ui-draggable-dragging');
                },
                stop: function(event, ui) {
                    $(this).removeClass('dragging');
                }
            });
            
            // Initialize droppable areas
            $('.emotion-box').droppable({
                accept: '.technique-item',
                tolerance: 'pointer',
                hoverClass: 'ui-droppable-hover',
                activeClass: 'ui-droppable-active',
                drop: function(event, ui) {
                    // Get the dragged item
                    const draggedItem = ui.draggable;
                    const dropZone = $(this);
                    
                    // Remove any existing placeholder
                    dropZone.find('.placeholder').remove();
                    
                    // Check if this item is already in another box
                    const existingParent = draggedItem.parent();
                    if (!existingParent.is('#tech-list') && !existingParent.is(dropZone)) {
                        // Return the existing item to the tech list first
                        const techList = $('#tech-list');
                        
                        // If the item is already in a different emotion-box, add placeholder back
                        if (existingParent.hasClass('emotion-box')) {
                            const placeholder = $('<span class="placeholder">Drop technique here</span>');
                            const emotionLabel = existingParent.find('.emotion-label');
                            if (emotionLabel.length) {
                                placeholder.insertBefore(emotionLabel);
                            } else {
                                existingParent.append(placeholder);
                            }
                        }
                    }
                    
                    // Check if there's already an item in this box
                    const existingItem = dropZone.find('.technique-item');
                    if (existingItem.length > 0 && !existingItem.is(draggedItem)) {
                        // Put the existing item back to tech-list
                        $('#tech-list').append(existingItem);
                    }
                    
                    // Place the dragged item in the drop zone
                    const emotionLabel = dropZone.find('.emotion-label');
                    if (emotionLabel.length) {
                        draggedItem.insertBefore(emotionLabel);
                    } else {
                        dropZone.append(draggedItem);
                    }
                    
                    // Reset the draggable item's position
                    draggedItem.css({
                        top: 0,
                        left: 0,
                        position: 'relative'
                    });
                    
                    // Re-initialize draggable
                    draggedItem.draggable({
                        revert: 'invalid',
                        helper: 'clone',
                        cursor: 'move',
                        zIndex: 100
                    });
                    
                    // Save current selections
                    if (typeof saveCurrentSelections === 'function') {
                        setTimeout(saveCurrentSelections, 100);
                    }
                }
            });
            
            // Allow dropping back to tech-list
            $('#tech-list').droppable({
                accept: '.technique-item',
                drop: function(event, ui) {
                    const draggedItem = ui.draggable;
                    const prevParent = draggedItem.parent();
                    
                    // Add the item back to tech-list
                    $(this).append(draggedItem);
                    
                    // Reset position
                    draggedItem.css({
                        top: 0,
                        left: 0,
                        position: 'relative'
                    });
                    
                    // Add placeholder back to the previous parent if it was an emotion-box
                    if (prevParent.hasClass('emotion-box') && 
                        prevParent.find('.technique-item').length === 0 && 
                        prevParent.find('.placeholder').length === 0) {
                        
                        const placeholder = $('<span class="placeholder">Drop technique here</span>');
                        const emotionLabel = prevParent.find('.emotion-label');
                        if (emotionLabel.length) {
                            placeholder.insertBefore(emotionLabel);
                        } else {
                            prevParent.append(placeholder);
                        }
                    }
                    
                    // Save current selections
                    if (typeof saveCurrentSelections === 'function') {
                        setTimeout(saveCurrentSelections, 100);
                    }
                }
            });
            
            console.log('Enhanced drag and drop initialized!');
        } else {
            console.error('jQuery or jQuery UI not available');
        }
    }
}); 