/*
This file is part of Ext JS 3.4

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as
published by the Free Software Foundation and appearing in the file LICENSE included in the
packaging of this file.

Please review the following information to ensure the GNU General Public License version 3.0
requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-04-03 15:07:25
*/
/*
 * Note that this control will most likely remain as an example, and not as a core Ext form
 * control.  However, the API will be changing in a future release and so should not yet be
 * treated as a final, stable API at this time.
 */

/**
 * @class Ext.ux.form.ItemSelector
 * @extends Ext.form.Field
 * A control that allows selection of between two Ext.ux.form.MultiSelect controls.
 *
 *  @history
 *    2008-06-19 bpm Original code contributed by Toby Stuart (with contributions from Robert Williams)
 *
 * @constructor
 * Create a new ItemSelector
 * @param {Object} config Configuration options
 * @xtype itemselector 
 */
Ext.ux.form.ItemSelector = Ext.extend(Ext.form.Field,  {
    hideNavIcons:false,
    imagePath:"",
    iconUp:"up2.gif",
    iconDown:"down2.gif",
    iconLeft:"left2.gif",
    iconRight:"right2.gif",
    iconTop:"top2.gif",
    iconBottom:"bottom2.gif",
    drawUpIcon:true,
    drawDownIcon:true,
    drawLeftIcon:true,
    drawRightIcon:true,
    drawTopIcon:true,
    drawBotIcon:true,
    delimiter:',',
    bodyStyle:null,
    border:false,
    defaultAutoCreate:{tag: "div"},
    /**
     * @cfg {Array} multiselects An array of {@link Ext.ux.form.MultiSelect} config objects, with at least all required parameters (e.g., store)
     */
    multiselects:null,
	childColCount: 1,

    // PK
    allChildStoreAdded: undefined,

    // PK
    allChildStoreRemoved: undefined,

    initComponent: function(){
        Ext.ux.form.ItemSelector.superclass.initComponent.call(this);
        this.addEvents({
            'rowdblclick' : true,
            'change' : true
        });
    },

    onRender: function(ct, position){        
        Ext.ux.form.ItemSelector.superclass.onRender.call(this, ct, position);

        // Internal default configuration for both multiselects
        var msConfig = [{
            legend: 'Available',
            draggable: true,
            droppable: true,
            width: 100
            //height: 100
        },{
            //id: "Selection1",
            legend: 'Selected',
            droppable: true,
            draggable: true,
            width: 100
            //height: 100
        }
		// , {
            // //id: "Selection2",
            // legend: 'Selected2',
            // droppable: true,
            // draggable: true,
            // width: 100,
            // height: 100
        // }
		];

        //for selecter two items are there by default
        for(var p = 0; p < 2; p++){
            this.storeAddRemoveEvent(this.multiselects[p]);
        }

        
        
        this.fromMultiselect = new Ext.ux.form.MultiSelect(Ext.applyIf(this.multiselects[0], this.multiselects[0].msConfig ? this.multiselects[0].msConfig : msConfig[0]));
        this.fromMultiselect.on('dblclick', this.onRowDblClick, this);

        this.toMultiselect = new Ext.ux.form.MultiSelect(Ext.applyIf(this.multiselects[1], this.multiselects[1].msConfig ? this.multiselects[1].msConfig : msConfig[1]));
        //this.toMultiselect.on('dblclick', this.onRowDblClick, this);
		
		this.toMultiSelectAyr = [];
		var multiSelectLen = this.multiselects.length;
		
		for(var i = 2; i < multiSelectLen; i++){
			this.storeAddRemoveEvent(this.multiselects[i]);
            this.toMultiSelectAyr.push(new Ext.ux.form.MultiSelect(Ext.applyIf(this.multiselects[i], this.multiselects[i].msConfig ? this.multiselects[i].msConfig : msConfig[1])));
		}
        
		// this.toMultiselectSingle = new Ext.ux.form.MultiSelect(Ext.applyIf(this.multiselects[2], msConfig[2]));
        // //this.toMultiselectSingle.on('dblclick', this.onRowDblClick, this);
		
		// this.toMultiselectSingle1 = new Ext.ux.form.MultiSelect(Ext.applyIf(this.multiselects[3], msConfig[3]));

        var p = new Ext.Panel({
            bodyStyle:this.bodyStyle,
            border:this.border,
            layout:"table",
            style: 'width: 100%;',
            layoutConfig:{
                columns:2, 
                autoWidth: true 
            }
        });

        var pChild = new Ext.Panel({
            bodyStyle: this.bodyStyle,
            border: this.border,
            layout: "table",
            //layoutConfig: { columns: 2 }
            style: 'width: 100%; padding-left: 5px;',
            autoWidth: true,
            layoutConfig: { 
                columns: this.childColCount, 
                autoWidth: true  
            }
        });

        p.add(this.fromMultiselect);
        var icons = new Ext.Panel({header:false});
        //p.add(icons);
        //p.add(this.toMultiselect);
        //p.add(this.toMultiselectSingle);
        pChild.add(this.toMultiselect);
		
		for(var i = 0; i < this.toMultiSelectAyr.length; i++){
			pChild.add(this.toMultiSelectAyr[i]);
		}
		
		//pChild.add(this.toMultiselectSingle);
        //pChild.add(this.toMultiselectSingle1);
        p.add(pChild);
        p.render(this.el);
        //icons.el.down('.'+icons.bwrapCls).remove();

        // ICON HELL!!!
        if (this.imagePath!="" && this.imagePath.charAt(this.imagePath.length-1)!="/")
            this.imagePath+="/";
        this.iconUp = this.imagePath + (this.iconUp || 'up2.gif');
        this.iconDown = this.imagePath + (this.iconDown || 'down2.gif');
        this.iconLeft = this.imagePath + (this.iconLeft || 'left2.gif');
        this.iconRight = this.imagePath + (this.iconRight || 'right2.gif');
        this.iconTop = this.imagePath + (this.iconTop || 'top2.gif');
        this.iconBottom = this.imagePath + (this.iconBottom || 'bottom2.gif');
        var el=icons.getEl();
		
		if(el){
			this.toTopIcon = el.createChild({tag:'img', src:this.iconTop, style:{cursor:'pointer', margin:'2px'}});
			el.createChild({tag: 'br'});
			this.upIcon = el.createChild({tag:'img', src:this.iconUp, style:{cursor:'pointer', margin:'2px'}});
			el.createChild({tag: 'br'});
			this.addIcon = el.createChild({tag:'img', src:this.iconRight, style:{cursor:'pointer', margin:'2px'}});
			el.createChild({tag: 'br'});
			this.removeIcon = el.createChild({tag:'img', src:this.iconLeft, style:{cursor:'pointer', margin:'2px'}});
			el.createChild({tag: 'br'});
			this.downIcon = el.createChild({tag:'img', src:this.iconDown, style:{cursor:'pointer', margin:'2px'}});
			el.createChild({tag: 'br'});
			this.toBottomIcon = el.createChild({tag:'img', src:this.iconBottom, style:{cursor:'pointer', margin:'2px'}});
			this.toTopIcon.on('click', this.toTop, this);
			this.upIcon.on('click', this.up, this);
			this.downIcon.on('click', this.down, this);
			this.toBottomIcon.on('click', this.toBottom, this);
			this.addIcon.on('click', this.fromTo, this);
			this.removeIcon.on('click', this.toFrom, this);
			if (!this.drawUpIcon || this.hideNavIcons) { this.upIcon.dom.style.display='none'; }
			if (!this.drawDownIcon || this.hideNavIcons) { this.downIcon.dom.style.display='none'; }
			if (!this.drawLeftIcon || this.hideNavIcons) { this.addIcon.dom.style.display='none'; }
			if (!this.drawRightIcon || this.hideNavIcons) { this.removeIcon.dom.style.display='none'; }
			if (!this.drawTopIcon || this.hideNavIcons) { this.toTopIcon.dom.style.display='none'; }
			if (!this.drawBotIcon || this.hideNavIcons) { this.toBottomIcon.dom.style.display='none'; }

			var tb = p.body.first();
			this.el.setWidth(p.body.first().getWidth());
			p.body.removeClass();

			this.hiddenName = this.name;
			var hiddenTag = {tag: "input", type: "hidden", value: "", name: this.name};
			this.hiddenField = this.el.createChild(hiddenTag);
		}
    },

    // PK - private
    storeAddRemoveEvent: function(multiselect){
        if(multiselect){
            //check if no custom storeAdded event has been added then add the global event
            if(!multiselect.storeAdded){
                multiselect.storeAdded = this.allChildStoreAdded;
            }

            //check if no custom storeRemoved event has been added then add the global event
            if(!multiselect.storeRemoved){
                multiselect.storeRemoved = this.allChildStoreRemoved;
            }

            if(!multiselect.curScope){
                multiselect.curScope = this.curScope;
            }
        }
    },
    
    doLayout: function(reRenderViews){
        if(this.rendered){
            if(!reRenderViews){
                // PK - layout should happen only once by internal calls
                this.fromMultiselect.fs.doLayout();
                this.toMultiselect.fs.doLayout();
            }
            else{
                // PK - forcefully refresh the child panel to display custom texts
                this.toMultiselect.viewAfterRender(this.toMultiselect.view);
            }

            if(this.toMultiSelectAyr){
                for(var i = this.toMultiSelectAyr.length - 1; i >= 0; i--){
                    if(!reRenderViews){
                        // PK - layout should happen only once by internal calls
                        this.toMultiSelectAyr[i].fs.doLayout();
                    }
                    if(reRenderViews){
                        // PK - forcefully refresh the child panel to display custom texts
                        this.toMultiSelectAyr[i].viewAfterRender(this.toMultiSelectAyr[i].view);
                    }
                }
            }
        }
    },

    afterRender: function(){
        Ext.ux.form.ItemSelector.superclass.afterRender.call(this);

        this.toStore = this.toMultiselect.store;
        this.toStore.on('add', this.valueChanged, this);
        this.toStore.on('remove', this.valueChanged, this);
        this.toStore.on('load', this.valueChanged, this);
        this.valueChanged(this.toStore);
    },

    toTop : function() {
        var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
        var records = [];
        if (selectionsArray.length > 0) {
            selectionsArray.sort();
            for (var i=0; i<selectionsArray.length; i++) {
                record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
                records.push(record);
            }
            selectionsArray = [];
            for (var i=records.length-1; i>-1; i--) {
                record = records[i];
                this.toMultiselect.view.store.remove(record);
                this.toMultiselect.view.store.insert(0, record);
                selectionsArray.push(((records.length - 1) - i));
            }
        }
        this.toMultiselect.view.refresh();
        this.toMultiselect.view.select(selectionsArray);
    },

    toBottom : function() {
        var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
        var records = [];
        if (selectionsArray.length > 0) {
            selectionsArray.sort();
            for (var i=0; i<selectionsArray.length; i++) {
                record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
                records.push(record);
            }
            selectionsArray = [];
            for (var i=0; i<records.length; i++) {
                record = records[i];
                this.toMultiselect.view.store.remove(record);
                this.toMultiselect.view.store.add(record);
                selectionsArray.push((this.toMultiselect.view.store.getCount()) - (records.length - i));
            }
        }


        this.toMultiselect.view.refresh();
        this.toMultiselect.view.select(selectionsArray);
    },

    up : function() {
        var record = null;
        var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
        selectionsArray.sort();
        var newSelectionsArray = [];
        if (selectionsArray.length > 0) {
            for (var i=0; i<selectionsArray.length; i++) {
                record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
                if ((selectionsArray[i] - 1) >= 0) {
                    this.toMultiselect.view.store.remove(record);
                    this.toMultiselect.view.store.insert(selectionsArray[i] - 1, record);
                    newSelectionsArray.push(selectionsArray[i] - 1);
                }
            }

            if (newSelectionsArray.length > 0) {
                this.toMultiselect.view.refresh();
                this.toMultiselect.view.select(newSelectionsArray);
            }
        }
    },

    down : function() {
        var record = null;
        var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
        selectionsArray.sort();
        selectionsArray.reverse();
        var newSelectionsArray = [];
        if (selectionsArray.length > 0) {
            for (var i=0; i<selectionsArray.length; i++) {
                record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
                if ((selectionsArray[i] + 1) < this.toMultiselect.view.store.getCount()) {
                    this.toMultiselect.view.store.remove(record);
                    this.toMultiselect.view.store.insert(selectionsArray[i] + 1, record);
                    newSelectionsArray.push(selectionsArray[i] + 1);
                }
            }

            if (newSelectionsArray.length > 0) {
                this.toMultiselect.view.refresh();
                this.toMultiselect.view.select(newSelectionsArray);
            }
        }
    },

    fromTo : function() {
        var selectionsArray = this.fromMultiselect.view.getSelectedIndexes();
        var records = [];
        if (selectionsArray.length > 0) {
            for (var i=0; i<selectionsArray.length; i++) {
                record = this.fromMultiselect.view.store.getAt(selectionsArray[i]);
                records.push(record);
            }
            if(!this.allowDup)selectionsArray = [];
            for (var i=0; i<records.length; i++) {
                record = records[i];
                if(this.allowDup){
                    var x=new Ext.data.Record();
                    record.id=x.id;
                    delete x;
                    this.toMultiselect.view.store.add(record);
                }else{
                    this.fromMultiselect.view.store.remove(record);
                    this.toMultiselect.view.store.add(record);
                    selectionsArray.push((this.toMultiselect.view.store.getCount() - 1));
                }
            }
        }
        this.toMultiselect.view.refresh();
        this.fromMultiselect.view.refresh();
        var si = this.toMultiselect.store.sortInfo;
        if(si){
            this.toMultiselect.store.sort(si.field, si.direction);
        }
        this.toMultiselect.view.select(selectionsArray);
    },

    toFrom : function() {
        var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
        var records = [];
        if (selectionsArray.length > 0) {
            for (var i=0; i<selectionsArray.length; i++) {
                record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
                records.push(record);
            }
            selectionsArray = [];
            for (var i=0; i<records.length; i++) {
                record = records[i];
                this.toMultiselect.view.store.remove(record);
                if(!this.allowDup){
                    this.fromMultiselect.view.store.add(record);
                    selectionsArray.push((this.fromMultiselect.view.store.getCount() - 1));
                }
            }
        }
        this.fromMultiselect.view.refresh();
        this.toMultiselect.view.refresh();
        var si = this.fromMultiselect.store.sortInfo;
        if (si){
            this.fromMultiselect.store.sort(si.field, si.direction);
        }
        this.fromMultiselect.view.select(selectionsArray);
    },

    valueChanged: function(store) {
        if(this.hiddenField){
			var record = null;
			var values = [];
			for (var i=0; i<store.getCount(); i++) {
				record = store.getAt(i);
				values.push(record.get(this.toMultiselect.valueField));
			}
					
			this.hiddenField.dom.value = values.join(this.delimiter);
			this.fireEvent('change', this, this.getValue(), this.hiddenField.dom.value);
		}
    },

    getValue : function() {
        return this.hiddenField ? this.hiddenField.dom.value : '';
    },

    onRowDblClick : function(vw, index, node, e) {
        //if (vw == this.toMultiselect.view || this.toMultiselectSingle.view) {
        if (vw == this.toMultiselect.view || this.toMultiselectSingle.view || this.toMultiselectSingle1.view) {
            this.toFrom();
        } else if (vw == this.fromMultiselect.view) {
            this.fromTo();
        }
        return this.fireEvent('rowdblclick', vw, index, node, e);
    },

    reset: function(){
        range = this.toMultiselect.store.getRange();
        this.toMultiselect.store.removeAll();
        this.fromMultiselect.store.add(range);
        var si = this.fromMultiselect.store.sortInfo;
        if (si){
            this.fromMultiselect.store.sort(si.field, si.direction);
        }
        this.valueChanged(this.toMultiselect.store);
    }
});

Ext.reg('itemselector', Ext.ux.form.ItemSelector);

//backwards compat
Ext.ux.ItemSelector = Ext.ux.form.ItemSelector;
