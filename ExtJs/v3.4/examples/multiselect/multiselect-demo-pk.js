Ext.onReady(function(){

	//My stores

	this.grupByFunc = [
	{
		text: 'Min',
		val: 0
	},{
		text: 'Max',
		val: 1
	},{
		text: 'Average',
		val: 2
	},{
		text: 'Sum',
		val: 3
	},{
		text: 'Count',
		val: 4
	},{
		text: 'Variance',
		val: 5
	},{
		text: 'StdDev',
		val: 6
	}];
	
	this.allFieldsStore = new Ext.data.ArrayStore({
		fields: ['ColumnName','ColumnCaption', 'DataType'],
		data: [
			['String1', 'String1', 'String'],
			['String2', 'String2', 'String'],
			['Number1', 'Number1', 'Number'],
			['Number2', 'Number2', 'Number'],
			['Number3', 'Number3', 'Number'],
			['Date1', 'Date1', 'Date'],
			['Date2', 'Date2', 'Date'],
			['Date3', 'Date3', 'Date'],
			['Date4', 'Date4', 'Date']
		]
	});

	new Ext.form.FormPanel({
		title: 'ItemSelector Test',
		width: 650,
		renderTo: 'itemselectorDiv',
		items: [{
			xtype: 'itemselector',
			name: 'itemselectorClient',
			cdgProp: 'SC.GroupOperation',
			imagePath: '../ux/images/',
			childColCount: 2,
			//cValidation: this.validateGroupingClient,
			multiselects: [{
				width: 225,
				height: 202,
				store: this.allFieldsStore,
				displayField: 'ColumnCaption',
				valueField: 'ColumnName',
				jqueryAlias: PK.jQuery,
				msConfig: {
					legend: 'Fields',
					draggable: true,
					droppable: true,
					width: 100
				},
				triggerBlurOn: 'cFromClientGrpValues'
			},{
				width: 406,
				height: 100,
				store: new Ext.data.ArrayStore({
					data: [],
					fields: ['ColumnName','ColumnCaption', 'DataType']
				}),
				displayField: 'ColumnCaption',
				valueField: 'ColumnName',
				jqueryAlias: PK.jQuery,
				colspan: 2,
				cls: 'grp-Fld',
				msConfig: {
					legend: 'Rows',
					draggable: true,
					droppable: true,
					width: 100
				},
				triggerBlurOn: 'cFromClientGrpValues'
			}, {
				width: 406,
				height: 100,
				id: 'cFromClientGrpValues',
				store: new Ext.data.ArrayStore({
					data: [],
					fields: ['ColumnName','ColumnCaption', 'DataType', 'selVal']
				}),
				displayField: 'ColumnCaption',
				valueField: 'ColumnName',
				dynamicComboStore: this.grupByFunc,
				dynamicComboDisplay: 'text',
				dynamicComboVal: 'val',
				dynamicComboDefValIndx: [4],
				jqueryAlias: PK.jQuery,
				colspan: 2,
				cls: 'grp-Fld',
				msConfig: {
					legend: 'Values',
					draggable: true,
					droppable: true,
					width: 100
				},
				triggerBlurOn: 'cFromClientGrpValues'
			}]
			,
			listeners:{
				afterrender: function(){
					PK.jQuery(PK.jQuery(this.el.dom).parent().parent()).find('label').remove();
					PK.jQuery(this.el.dom).parent().css('padding-left', '5px');
				}
			}
		}]
	})
});