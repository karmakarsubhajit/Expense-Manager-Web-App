
var budContr = (function() {
    
    var Expenditure = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percentage = -1;
    };
    
    
    Expenditure.prototype.calcPerc = function(totInc) {
        if (totInc > 0) {
            this.percentage = Math.round((this.value / totInc) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    
    Expenditure.prototype.getPerc = function() {
        return this.percentage;
    };
    
    
    var Income = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };
    
    
    var calcTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        account: 0,
        percentage: -1
    };
    
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            

            if (type === 'exp') {
                newItem = new Expenditure(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            

            data.allItems[type].push(newItem);
            

            return newItem;
        },
        
        
        deleteItem: function(type, id) {
            var ids, index;
            

            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
        
        
        calcAccount: function() {
            

            calcTotal('exp');
            calcTotal('inc');
            

            data.account = data.totals.inc - data.totals.exp;
            

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }            
            

        },
        
        calcPercentages: function() {
            
            
            data.allItems.exp.forEach(function(cur) {
               cur.calcPerc(data.totals.inc);
            });
        },
        
        
        getPercs: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPerc();
            });
            return allPerc;
        },
        
        
        getAccount: function() {
            return {
                account: data.account,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        
        testing: function() {
            console.log(data);
        }
    };
    
})();





var UIContr = (function() {
    
    var DOMstrings = {
        inpTy: '.add__type',
        inpDesc: '.add__desc',
        inpVal: '.add__value',
        inpBtn: '.add__btn',
        incCont: '.income__list',
        expCon: '.expenditures__list',
        budLab: '.account__value',
        incLab: '.account__income--value',
        expLab: '.account__expenditures--value',
        percLab: '.account__expenditures--percentage',
        cont: '.cont',
        expPercLab: '.item__percentage',
        dateLab: '.account__title--month'
    };
    
    
    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;


        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); 
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };
    
    
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inpTy).value, 
                desc: document.querySelector(DOMstrings.inpDesc).value,
                value: parseFloat(document.querySelector(DOMstrings.inpVal).value)
            };
        },
        
        
        addListItem: function(obj, type) {
            var html, newHtml, element;

            
            if (type === 'inc') {
                element = DOMstrings.incCont;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__desc">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expCon;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__desc">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
          
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%desc%', obj.desc);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
          
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        
        deleteListItem: function(selectorID) {
            
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
        },
        
        
        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inpDesc + ', ' + DOMstrings.inpVal);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
        
        
        displayAccount: function(obj) {
            var type;
            obj.account > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budLab).textContent = formatNumber(obj.account, type);
            document.querySelector(DOMstrings.incLab).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expLab).textContent = formatNumber(obj.totalExp, 'exp');
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percLab).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percLab).textContent = '---';
            }
            
        },
        
        
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expPercLab);
            
            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },
        
        
        displayMonth: function() {
            var now, months, month, year;
            
            now = new Date();
          

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLab).textContent = months[month] + ' ' + year;
        },
        
        
        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMstrings.inpTy + ',' +
                DOMstrings.inpDesc + ',' +
                DOMstrings.inpVal);
            
            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMstrings.inpBtn).classList.toggle('red');
            
        },
        
        
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
    
})();





var cont = (function(accountCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inpBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        
        document.querySelector(DOM.cont).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inpTy).addEventListener('change', UICtrl.changedType);        
    };
    
    
    var updateAccount = function() {
        

        accountCtrl.calcAccount();
        

        var account = accountCtrl.getAccount();
        

        UICtrl.displayAccount(account);
    };
    
    
    var updatePercentages = function() {
        

        accountCtrl.calcPercentages();
        

        var percentages = accountCtrl.getPercs();
        

        UICtrl.displayPercentages(percentages);
    };
    
    
    var ctrlAddItem = function() {
        var input, newItem;
        

        input = UICtrl.getInput();        
        
        if (input.desc !== "" && !isNaN(input.value) && input.value > 0) {

            newItem = accountCtrl.addItem(input.type, input.desc, input.value);


            UICtrl.addListItem(newItem, input.type);


            UICtrl.clearFields();


            updateAccount();
            


            updatePercentages();
        }
    };
    
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            

            accountCtrl.deleteItem(type, ID);
            

            UICtrl.deleteListItem(itemID);
            

            updateAccount();
            

            updatePercentages();
        }
    };
    
    
    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayAccount({
                account: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
    
})(budContr, UIContr);


cont.init();

var budContr = (function() {
    
    var Expenditure = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percentage = -1;
    };
    
    
    Expenditure.prototype.calcPerc = function(totInc) {
        if (totInc > 0) {
            this.percentage = Math.round((this.value / totInc) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    
    Expenditure.prototype.getPerc = function() {
        return this.percentage;
    };
    
    
    var Income = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };
    
    
    var calcTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        account: 0,
        percentage: -1
    };
    
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            

            if (type === 'exp') {
                newItem = new Expenditure(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            

            data.allItems[type].push(newItem);
            

            return newItem;
        },
        
        
        deleteItem: function(type, id) {
            var ids, index;
            

            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
        
        
        calcAccount: function() {
            

            calcTotal('exp');
            calcTotal('inc');
            

            data.account = data.totals.inc - data.totals.exp;
            

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }            
            

        },
        
        calcPercentages: function() {
            
            
            data.allItems.exp.forEach(function(cur) {
               cur.calcPerc(data.totals.inc);
            });
        },
        
        
        getPercs: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPerc();
            });
            return allPerc;
        },
        
        
        getAccount: function() {
            return {
                account: data.account,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        
        testing: function() {
            console.log(data);
        }
    };
    
})();





var UIContr = (function() {
    
    var DOMstrings = {
        inpTy: '.add__type',
        inpDesc: '.add__desc',
        inpVal: '.add__value',
        inpBtn: '.add__btn',
        incCont: '.income__list',
        expCon: '.expenditures__list',
        budLab: '.account__value',
        incLab: '.account__income--value',
        expLab: '.account__expenditures--value',
        percLab: '.account__expenditures--percentage',
        cont: '.cont',
        expPercLab: '.item__percentage',
        dateLab: '.account__title--month'
    };
    
    
    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;


        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); 
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };
    
    
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inpTy).value, 
                desc: document.querySelector(DOMstrings.inpDesc).value,
                value: parseFloat(document.querySelector(DOMstrings.inpVal).value)
            };
        },
        
        
        addListItem: function(obj, type) {
            var html, newHtml, element;

            
            if (type === 'inc') {
                element = DOMstrings.incCont;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__desc">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expCon;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__desc">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
          
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%desc%', obj.desc);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
          
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        
        deleteListItem: function(selectorID) {
            
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
        },
        
        
        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inpDesc + ', ' + DOMstrings.inpVal);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
        
        
        displayAccount: function(obj) {
            var type;
            obj.account > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budLab).textContent = formatNumber(obj.account, type);
            document.querySelector(DOMstrings.incLab).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expLab).textContent = formatNumber(obj.totalExp, 'exp');
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percLab).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percLab).textContent = '---';
            }
            
        },
        
        
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expPercLab);
            
            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },
        
        
        displayMonth: function() {
            var now, months, month, year;
            
            now = new Date();
          

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLab).textContent = months[month] + ' ' + year;
        },
        
        
        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMstrings.inpTy + ',' +
                DOMstrings.inpDesc + ',' +
                DOMstrings.inpVal);
            
            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMstrings.inpBtn).classList.toggle('red');
            
        },
        
        
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
    
})();





var cont = (function(accountCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inpBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        
        document.querySelector(DOM.cont).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inpTy).addEventListener('change', UICtrl.changedType);        
    };
    
    
    var updateAccount = function() {
        

        accountCtrl.calcAccount();
        

        var account = accountCtrl.getAccount();
        

        UICtrl.displayAccount(account);
    };
    
    
    var updatePercentages = function() {
        

        accountCtrl.calcPercentages();
        

        var percentages = accountCtrl.getPercs();
        

        UICtrl.displayPercentages(percentages);
    };
    
    
    var ctrlAddItem = function() {
        var input, newItem;
        

        input = UICtrl.getInput();        
        
        if (input.desc !== "" && !isNaN(input.value) && input.value > 0) {

            newItem = accountCtrl.addItem(input.type, input.desc, input.value);


            UICtrl.addListItem(newItem, input.type);


            UICtrl.clearFields();


            updateAccount();
            


            updatePercentages();
        }
    };
    
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            

            accountCtrl.deleteItem(type, ID);
            

            UICtrl.deleteListItem(itemID);
            

            updateAccount();
            

            updatePercentages();
        }
    };
    
    
    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayAccount({
                account: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
    
})(budContr, UIContr);


cont.init();
