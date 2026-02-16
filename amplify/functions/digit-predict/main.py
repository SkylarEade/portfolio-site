import numpy as np

class NeuralNetwork:
    def __init__(self):
        self.W1 = np.random.randn(784,512) * 0.1 # Weight initialziation
        self.W2 = np.random.randn(512,128) * 0.1
        self.W3 = np.random.randn(128, 10) * 0.1
        self.b1 = np.zeros((512, 1)) # Bias initialization
        self.b2 = np.zeros((128, 1))
        self.b3 = np.zeros((10, 1))

        # Initialize momentum and variance for Adam implementation
        self.time_step = 0
        self.momentum = 0.9
        self.variance = 0.999
        self.stability = 1e-8
        self.W1_m = np.zeros((784, 512))
        self.W1_v = np.zeros((784, 512))
        self.W2_m = np.zeros((512, 128))
        self.W2_v = np.zeros((512, 128))
        self.W3_m = np.zeros((128, 10))
        self.W3_v = np.zeros((128, 10))
        self.b1_m = np.zeros((512, 1))
        self.b1_v = np.zeros((512, 1))
        self.b2_m = np.zeros((128, 1))
        self.b2_v = np.zeros((128, 1))
        self.b3_m = np.zeros((10, 1))
        self.b3_v = np.zeros((10, 1))

    def sigmoid(self, arr):
        return 1/ (1+np.exp(-arr)) # Sigmoid function for compressing the weights into 0 - 1 range
    
    def relu(self, z):
        return np.maximum(0, z)

    def forward_propagation(self, X):
        """
        X = 784 x 1 array representing the 28 x 28 pixel image
        W = Weight
        b = Bias
        """
        z1 = self.W1.T @ X + self.b1
        a1 = self.relu(z1)
        z2 = self.W2.T @ a1 + self.b2
        a2 = self.relu(z2)
        z3 = self.W3.T @ a2 + self.b3
        a3 = self.sigmoid(z3)
        return a1, a2, z1, a3, z2

    def calculate_loss(self, y_one_hot, prediction):
        return np.mean((prediction - y_one_hot) ** 2)
        
    def relu_derivative(self, z):
        return (z > 0).astype(float)

    def backwards_propagation(self, X, y_one_hot, a1, a2, a3, z1, z2):
        dL_da3 = a3 - y_one_hot
        dL_dz3 = dL_da3 * a3 * (1 - a3)
        dL_dW3 = a2 @ dL_dz3.T
        dL_da2 = self.W3 @ dL_dz3
        dL_dz2 = dL_da2 * self.relu_derivative(z2)
        dL_dW2 = a1 @ dL_dz2.T
        dL_da1 = self.W2 @ dL_dz2
        dL_dz1 = dL_da1 * self.relu_derivative(z1)
        dL_dW1 = X @ dL_dz1.T
        return dL_dW1, dL_dz1, dL_dW2, dL_dz2, dL_dW3, dL_dz3

    def update_weights(self, dW1, db1, dW2, db2, dW3, db3, learning_rate):
        self.time_step += 1
        t = self.time_step
        self.W1_m = self.momentum * self.W1_m + (1 - self.momentum) * dW1
        self.W2_m = self.momentum * self.W2_m + (1 - self.momentum) * dW2
        self.W3_m = self.momentum * self.W3_m + (1 - self.momentum) * dW3
        self.b1_m = self.momentum * self.b1_m + (1 - self.momentum) * db1 
        self.b2_m = self.momentum * self.b2_m + (1 - self.momentum) * db2
        self.b3_m = self.momentum * self.b3_m + (1 - self.momentum) * db3
        self.W1_v = self.variance * self.W1_v + (1 - self.variance) * dW1**2
        self.W2_v = self.variance * self.W2_v + (1 - self.variance) * dW2**2
        self.W3_v = self.variance * self.W3_v + (1 - self.variance) * dW3**2
        self.b1_v = self.variance * self.b1_v + (1 - self.variance) * db1**2 
        self.b2_v = self.variance * self.b2_v + (1 - self.variance) * db2**2
        self.b3_v = self.variance * self.b3_v + (1 - self.variance) * db3**2
        self.W1 -= learning_rate * (self.W1_m / (1 - self.momentum**t)) / (np.sqrt(self.W1_v / (1 - self.variance**t)) + self.stability)
        self.W2 -= learning_rate * (self.W2_m / (1 - self.momentum**t)) / (np.sqrt(self.W2_v / (1 - self.variance**t)) + self.stability)
        self.W3 -= learning_rate * (self.W3_m / (1 - self.momentum**t)) / (np.sqrt(self.W3_v / (1 - self.variance**t)) + self.stability)
        self.b1 -= learning_rate * (self.b1_m / (1 - self.momentum**t)) / (np.sqrt(self.b1_v / (1 - self.variance**t)) + self.stability)
        self.b2 -= learning_rate * (self.b2_m / (1 - self.momentum**t)) / (np.sqrt(self.b2_v / (1 - self.variance**t)) + self.stability)
        self.b3 -= learning_rate * (self.b3_m / (1 - self.momentum**t)) / (np.sqrt(self.b3_v / (1 - self.variance**t)) + self.stability)

    def push_update_weight(self, dW1_sum, dW2_sum, dW3_sum, db1_sum, db2_sum, db3_sum, size, learning_rate):
        dW1_avg = dW1_sum / size
        dW2_avg = dW2_sum / size
        dW3_avg = dW3_sum / size
        db1_avg = db1_sum / size
        db2_avg = db2_sum / size
        db3_avg = db3_sum / size
        self.update_weights(dW1_avg, db1_avg, dW2_avg, db2_avg, dW3_avg, db3_avg, learning_rate)
        return (np.zeros_like(dW1_sum), np.zeros_like(dW2_sum), np.zeros_like(dW3_sum), np.zeros_like(db1_sum), np.zeros_like(db2_sum), np.zeros_like(db3_sum))
    
    def train(self, X_train, y_train, epochs, learning_rate=0.001, batch_size=32):
        pass  # Not used in Lambda

    def save_model(self, filepath="models/mnist_model.npz"):
        np.savez(filepath, W1=self.W1, W2=self.W2, W3=self.W3, b1=self.b1, b2=self.b2, b3=self.b3)
    
    def load_model(self, filepath="models/mnist_model.npz"):
        data = np.load(filepath)
        self.W1 = data["W1"]
        self.W2 = data["W2"]
        self.W3 = data["W3"]
        self.b1 = data["b1"]
        self.b2 = data["b2"]
        self.b3 = data["b3"]
