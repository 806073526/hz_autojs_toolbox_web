package com.zjh.zxw.common.util.jdbc;

public class jdbcDemoMysql {

	static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";  
	static final String DB_URL = "jdbc:mysql://120.78.193.36:3306/member";
	static final String SQL ="SELECT * FROM h_moneylog limit 0,1";
	   //  Database credentials
	   static final String USER = "root";
	   static final String PASS = "zjh123";

	   /*public static void main(String[] args) {
	   Connection conn = null;
	   Statement stmt = null;
	   try{
	      //STEP 2: Register JDBC driver
	      Class.forName(JDBC_DRIVER);

	      //STEP 3: Open a connection
	      conn = DriverManager.getConnection(DB_URL,USER,PASS);

	      //STEP 4: Execute a query
	      stmt = conn.createStatement();
	      ResultSet rs = stmt.executeQuery(SQL);
	      //STEP 5: Extract data from result set
	      while(rs.next()){
	         //Retrieve by column name
	         String last1 = rs.getString(1);
	         String last2 = rs.getString(2);
	         String last3 = rs.getString(3);
	         String last4 = rs.getString(4);
	         String last5 = rs.getString(5);
	         System.out.println(last1);
	         System.out.println(last2);
	         System.out.println(last3);
	         System.out.println(last4);
	         System.out.println(last5);
	         
	      }
	      //STEP 6: Clean-up environment
	      rs.close();
	      stmt.close();
	      conn.close();
	   }catch(SQLException se){
	      //Handle errors for JDBC
	      se.printStackTrace();
	   }catch(Exception e){
	      //Handle errors for Class.forName
	      e.printStackTrace();
	   }finally{
	      //finally block used to close resources
	      try{
	         if(stmt!=null)
	            stmt.close();
	      }catch(SQLException se2){
	      }// nothing we can do
	      try{
	         if(conn!=null)
	            conn.close();
	      }catch(SQLException se){
	         se.printStackTrace();
	      }//end finally try
	   }
	   }*/
}
