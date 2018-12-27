var fs = require('fs');

// ������ ��� ������ � �������� �������� �� ��������
module.exports = {
	
	// �������� ������������� �����
	exists : path => {
		
		// console.log(path)
		
		return new Promise ((resolve, reject) => {
			
			fs.exists(path, (exists) => {
				resolve(exists);
			});
			
		});
		
	},
	
	// �������� �����
	mkdir : path => {
		
		// Log.warn(path);	
		
		return new Promise ((resolve, reject) => {
			
			fs.mkdir(path, (result) => {
				
				// console.log(arguments);
				
				// console.log('Files.mkdir.result');
				// Log.delim();
				// Log.delim();
				// console.log(result);
				// Log.delim();
				// Log.delim();
				
				resolve();
			
			});
			
		});
		
	},
	
	// �������� �����
	deleteFile : path => {
		
		return new Promise((resolve, reject) => {
			
			fs.unlink(path, (result) => {
				
				// console.log('Files.deleteFile.result')
				// console.log(result);
				resolve(result);
				
			});
			
		});
		
	}
	
};