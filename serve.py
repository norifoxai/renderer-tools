import http.server, socketserver, functools
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory='/root/face3d/page')
socketserver.TCPServer.allow_reuse_address = True
s = socketserver.TCPServer(('127.0.0.1', 8777), h)
s.serve_forever()
