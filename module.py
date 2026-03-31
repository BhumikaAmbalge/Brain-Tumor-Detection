import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error

class DataAnalyzer:
    def __init__(self, data_path):
        self.data = pd.read_csv(data_path)
        self.model = None

    def preprocess(self, target_column):
        # Drop rows with missing values
        self.data = self.data.dropna()
        # Separate features and target
        X = self.data.drop(target_column, axis=1)
        y = self.data[target_column]
        return train_test_split(X, y, test_size=0.2, random_state=42)

    def train_model(self, X_train, y_train):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)

    def evaluate(self, X_test, y_test):
        predictions = self.model.predict(X_test)
        mse = mean_squared_error(y_test, predictions)
        print(f"Mean Squared Error: {mse:.4f}")
        return mse

    def predict(self, X_new):
        return self.model.predict(X_new)

# Example usage:
# analyzer = DataAnalyzer('your_data.csv')
# X_train, X_test, y_train, y_test = analyzer.preprocess(target_column='target')
# analyzer.train_model(X_train, y_train)
# analyzer.evaluate(X_test, y_test)
# predictions = analyzer.predict(X_test)